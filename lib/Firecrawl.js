
import Firecrawl from '@mendable/firecrawl-js';

export async function scrapeProduct(url) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
        throw new Error("FIRECRAWL_API_KEY is not set in environment variables");
    }
    const firecrawl = new Firecrawl({ apiKey });

    try {

        const result = await firecrawl.scrape(url, {
            formats: [
                {
                    type: "json",
                    schema: {
                        type: "object",
                        required: ["productName", "currentPrice"],
                        properties: {
                            productName: {
                                type: "string",
                            },
                            currentPrice: {
                                type: "string",
                            },
                            currencyCode: {
                                type: "string",
                            },
                            productImageUrl: {
                                type: "string",
                            },
                        },
                    },
                    prompt: "Extract: productName, currentPrice (number), currencyCode, and productImageUrl.",
                },
            ],
            timeout: 30000, // 30 seconds
        });

        const extractedData = result.json;
        if (!extractedData || !extractedData.productName) {
            throw new Error("Failed to extract data");
        }
        return extractedData;
    } catch (error) {
        console.error("firecrawl Scrape error:", error);
        throw new Error(`Failed to scrape product :${error.message}`);
    }
}