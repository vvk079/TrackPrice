"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/utills/SupaBase/Server"
import { scrapeProduct } from "@/lib/Firecrawl"


export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/")
    redirect("/")

}
export async function addProduct(formData) {
    const url = formData.get("url")
    if (!url) {
        throw new Error("URL is required")
    }

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const productData = await scrapeProduct(url)
        if (!user) {
            throw new Error("User not found")
        }
        if (!productData.productName || !productData.currentPrice) {
            console.log(productData, "productData")
            return {
                error: "could not extract product info from this url"
            }
        }

        const newPrice = parseFloat(productData.currentPrice)
        const currency = productData.currencyCode || "USD"
        const { data: existingProduct } = await supabase
            .from("products")
            .select("id,current_price")
            .eq("url", url)
            .eq("user_id", user.id)
            .single()

        const isUpdate = !!existingProduct

        // upsert product 
        const { data: product, error: upsertError } = await supabase
            .from("products")
            .upsert({
                user_id: user.id,
                url,
                name: productData.productName,
                current_price: newPrice,
                currency: currency,
                img_url: productData.productImageUrl,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: "user_id,url",
                ignoreDuplicates: false
            }
            )
            .select()
            .single();

        if (upsertError) {
            console.error("Upsert error:", upsertError)
            return {
                error: "Failed to add product: " + upsertError.message
            }
        }

        const shouldAddHistory =
            !isUpdate || existingProduct.current_price !== newPrice

        if (shouldAddHistory) {
            await supabase.from("price_history").insert({
                product_id: product.id,
                price: newPrice,
                currency: currency,
            })
        }

        revalidatePath("/")
        return {
            success: true,
            product,
            message: isUpdate ? "Product updated successfully" : "Product added successfully"
        }
    } catch (error) {
        console.error("add product error ", error)
        return {
            error: error.message || "Failed to add product"
        }
    }


}



export async function deleteProduct(productId) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", productId)

        if (error) {
            throw error
        }
        revalidatePath("/")
        return {
            success: true,
            message: "Product deleted successfully"
        }
    } catch (error) {
        console.error("delete product error ", error)
        return {
            error: "Failed to delete product"
        }
    }

}
export async function getProducts() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false })
        if (error) {
            throw error
        }
        return data || []
    } catch (error) {
        console.error("get products error: ", error.message || error)
        return []
    }


}


export async function getPriceHistory(productId) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("price_history")
            .select("*")
            .eq("product_id", productId)
            .order("checked_at", { ascending: false })
        if (error) {
            throw error
        }
        return data || []
    } catch (error) {
        console.error("get price history error: ", error.message || error)
        return []
    }
}