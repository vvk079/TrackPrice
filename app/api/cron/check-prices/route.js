import { NextResponse } from "next/server";
import { createAdminClient } from "@/utills/SupaBase/Server";
import { scrapeProduct } from "@/lib/Firecrawl";
import { sendPriceDropAlert } from "@/lib/email";

export async function GET() {
    return NextResponse.json({ message: "Hello" })
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get("authorization")
        const cronSecret = process.env.CRON_SECRET

        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const supabase = createAdminClient();

        const { data: products, error: productsError } = await supabase
            .from("products")
            .select("*");

        if (productsError) throw productsError;

        console.log(`Found ${products.length} products to check`)

        const result = {
            total: products.length,
            updated: 0,
            failed: 0,
            priceChanges: 0,
            alertsSent: 0,
        };

        for (const product of products) {
            try {
                const productData = await scrapeProduct(product.url);
                if (!productData.currentPrice) {
                    result.failed++;
                    continue;
                }

                const newPrice = parseFloat(productData.currentPrice);
                const oldPrice = parseFloat(product.current_price);

                await supabase
                    .from("products")
                    .update({
                        current_price: newPrice,
                        currency: productData.currencyCode || product.currency,
                        name: productData.productName || product.name,
                        img_url: productData.productImageUrl || product.img_url,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", product.id)

                if (oldPrice !== newPrice) {
                    await supabase
                        .from("price_history")
                        .insert({
                            product_id: product.id,
                            price: newPrice,
                            currency: productData.currencyCode || product.currency,
                            checked_at: new Date().toISOString()
                        })
                    result.priceChanges++;

                    if (newPrice < oldPrice) {
                        // Using admin to get user email if RLS restricts it
                        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(product.user_id);

                        if (user?.email) {
                            const emailResult = await sendPriceDropAlert(
                                user.email,
                                product,
                                oldPrice,
                                newPrice
                            );

                            if (emailResult.success) {
                                result.alertsSent++;
                            }
                        }
                    }
                }
                result.updated++;

            } catch (error) {
                console.error(`Failed to check price for product ${product.id}:`, error)
                result.failed++;
            }
        }

        return NextResponse.json({
            success: true,
            message: "Products checked successfully",
            result
        })

    } catch (error) {
        console.error("cron job error :", error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// curl -X POST https://dealbee.vercel.app/api/cron/check-prices -H "Authorization: Bearer 6a51b986a851687f684915eaa15cde9d8079881b2327c450f76ebc2a5ff3afd5"
