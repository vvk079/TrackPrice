"use client";

import { useEffect, useState } from "react";
import { getPriceHistory } from "@/app/Action";
import { Loader2, ArrowDown, ArrowUp, Minus, History } from "lucide-react";

export default function PriceHistoryTable({ productId, currency }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        async function loadData() {
            const data = await getPriceHistory(productId);
            setHistory(data || []);
            setLoading(false);
        }
        loadData();
    }, [productId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading history...
            </div>
        );
    }

    if (history.length === 0) {
        return null;
    }

    const displayed = showAll ? history : history.slice(0, 5);

    return (
        <div className="w-full mt-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-gray-500" />
                    Price History Log
                </h4>
                <span className="text-[11px] text-gray-400">
                    {history.length} record{history.length !== 1 ? "s" : ""}
                </span>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600">
                            <th className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wide">Date</th>
                            <th className="text-right px-3 py-2 font-medium text-xs uppercase tracking-wide">Price</th>
                            <th className="text-right px-3 py-2 font-medium text-xs uppercase tracking-wide">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayed.map((item, index) => {
                            const price = parseFloat(item.price);
                            // Compare with the next item (which is older since history is desc)
                            const nextItem = history[index + 1];
                            const prevPrice = nextItem ? parseFloat(nextItem.price) : null;
                            const change = prevPrice !== null ? price - prevPrice : null;
                            const changePercent = prevPrice !== null && prevPrice > 0
                                ? ((change / prevPrice) * 100).toFixed(1)
                                : null;

                            return (
                                <tr key={item.id || index} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-3 py-2 text-gray-600">
                                        <div className="text-sm">
                                            {new Date(item.checked_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                        <div className="text-[11px] text-gray-400">
                                            {new Date(item.checked_at).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-right font-semibold text-gray-800">
                                        {currency} {price}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                        {change !== null ? (
                                            <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${change < 0
                                                    ? "text-green-700 bg-green-50"
                                                    : change > 0
                                                        ? "text-red-600 bg-red-50"
                                                        : "text-gray-500 bg-gray-100"
                                                }`}>
                                                {change < 0 ? (
                                                    <ArrowDown className="w-3 h-3" />
                                                ) : change > 0 ? (
                                                    <ArrowUp className="w-3 h-3" />
                                                ) : (
                                                    <Minus className="w-3 h-3" />
                                                )}
                                                {changePercent !== null ? `${Math.abs(changePercent)}%` : "—"}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-gray-400">First</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {history.length > 5 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-2 text-center text-xs text-pink-600 hover:text-pink-700 font-medium py-1.5 rounded-md hover:bg-pink-50 transition-colors"
                >
                    {showAll ? "Show less" : `Show all ${history.length} entries`}
                </button>
            )}
        </div>
    );
}
