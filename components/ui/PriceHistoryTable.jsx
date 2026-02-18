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
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                    <div className="p-1.5 bg-muted rounded-lg">
                        <History className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    Price Timeline
                </h4>
                <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">
                    {history.length} checkpoint{history.length !== 1 ? "s" : ""}
                </span>
            </div>

            <div className="border border-border rounded-2xl overflow-hidden bg-card/30 backdrop-blur-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                            <th className="text-left px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Moment</th>
                            <th className="text-right px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Price</th>
                            <th className="text-right px-4 py-3 font-bold text-[10px] uppercase tracking-widest">Shift</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {displayed.map((item, index) => {
                            const price = parseFloat(item.price);
                            const nextItem = history[index + 1];
                            const prevPrice = nextItem ? parseFloat(nextItem.price) : null;
                            const change = prevPrice !== null ? price - prevPrice : null;
                            const changePercent = prevPrice !== null && prevPrice > 0
                                ? ((change / prevPrice) * 100).toFixed(1)
                                : null;

                            return (
                                <tr key={item.id || index} className="group hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-foreground">
                                            {new Date(item.checked_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </div>
                                        <div className="text-[10px] uppercase font-bold tracking-tighter text-muted-foreground/60">
                                            {new Date(item.checked_at).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-black text-foreground">
                                        {currency} {price}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {change !== null ? (
                                            <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${change < 0
                                                    ? "text-green-500 bg-green-500/10"
                                                    : change > 0
                                                        ? "text-red-500 bg-red-500/10"
                                                        : "text-muted-foreground bg-muted"
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
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">Init</span>
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
                    className="w-full mt-4 text-center text-[10px] uppercase font-black tracking-widest text-primary hover:text-primary/80 transition-all py-2 border border-primary/20 rounded-xl hover:bg-primary/5"
                >
                    {showAll ? "Collapse Logs" : `View all ${history.length} checkpoints`}
                </button>
            )}
        </div>
    );
}
