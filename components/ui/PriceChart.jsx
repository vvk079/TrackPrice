"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { getPriceHistory } from "@/app/Action";
import { Loader2 } from "lucide-react";

export default function PriceChart({ productId, currentPrice, currency, targetPrice }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const history = await getPriceHistory(productId);

            const chartData = history.map((item) => ({
                date: new Date(item.checked_at).toLocaleDateString(),
                price: parseFloat(item.price),
            }));

            // Append the current price as the latest "Now" point
            const now = parseFloat(currentPrice);
            if (!isNaN(now)) {
                // Avoid duplicate if the last history entry matches "now"
                const lastEntry = chartData[chartData.length - 1];
                if (
                    !lastEntry ||
                    lastEntry.price !== now ||
                    lastEntry.date !== new Date().toLocaleDateString()
                ) {
                    chartData.push({
                        date: "Now",
                        price: now,
                    });
                }
            }

            setData(chartData);
            setLoading(false);
        }

        loadData();
    }, [productId, currentPrice]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8 text-gray-500 w-full">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading chart...
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 w-full">
                No price data available.
            </div>
        );
    }

    const currentPriceNum = parseFloat(currentPrice);

    return (
        <div className="w-full">
            <h4 className="text-sm font-semibold mb-1 text-gray-700">
                Price History
            </h4>
            <p className="text-xs text-gray-500 mb-4">
                Current price: {currency} {currentPrice}
            </p>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                        }}
                        formatter={(value) => [`${currency} ${value}`, "Price"]}
                    />
                    {!isNaN(currentPriceNum) && (
                        <ReferenceLine
                            y={currentPriceNum}
                            stroke="#10b981"
                            strokeDasharray="5 5"
                            label={{
                                value: `Current: ${currency} ${currentPrice}`,
                                fill: "#10b981",
                                fontSize: 11,
                                position: "insideTopRight",
                            }}
                        />
                    )}
                    {targetPrice && !isNaN(parseFloat(targetPrice)) && (
                        <ReferenceLine
                            y={parseFloat(targetPrice)}
                            stroke="#ef4444"
                            strokeDasharray="8 4"
                            label={{
                                value: `Target: ${currency} ${targetPrice}`,
                                fill: "#ef4444",
                                fontSize: 11,
                                position: "insideBottomRight",
                            }}
                        />
                    )}
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#FA5D19"
                        strokeWidth={2}
                        dot={{ fill: "#FA5D19", r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
