"use client";

import { useEffect, useState } from "react";
import { getPriceStats } from "@/app/Action";
import { Loader2, TrendingDown, TrendingUp, Minus, Flame, ArrowDownRight } from "lucide-react";

export default function PriceStats({ productId, currentPrice, currency }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            const result = await getPriceStats(productId);
            setStats(result);
            setLoading(false);
        }
        loadStats();
    }, [productId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading stats...
            </div>
        );
    }

    if (!stats) return null;

    const current = parseFloat(currentPrice);
    const isAllTimeLow = current <= stats.lowest;
    const isAllTimeHigh = current >= stats.highest;
    const savings = stats.firstPrice - current;

    const statItems = [
        {
            label: "Lowest Ever",
            value: `${currency} ${stats.lowest}`,
            color: "text-green-500",
            bg: "bg-green-500/10",
            borderColor: "border-green-500/20",
            icon: <ArrowDownRight className="w-3.5 h-3.5" />,
        },
        {
            label: "Highest Ever",
            value: `${currency} ${stats.highest}`,
            color: "text-red-500",
            bg: "bg-red-500/10",
            borderColor: "border-red-500/20",
            icon: <TrendingUp className="w-3.5 h-3.5" />,
        },
        {
            label: "Average",
            value: `${currency} ${stats.average}`,
            color: "text-primary",
            bg: "bg-primary/10",
            borderColor: "border-primary/20",
            icon: <Minus className="w-3.5 h-3.5" />,
        },
        {
            label: "Since Tracking",
            value: `${stats.percentChange > 0 ? "+" : ""}${stats.percentChange}%`,
            color: stats.percentChange <= 0 ? "text-green-500" : "text-red-500",
            bg: stats.percentChange <= 0 ? "bg-green-500/10" : "bg-red-500/10",
            borderColor: stats.percentChange <= 0 ? "border-green-500/20" : "border-red-500/20",
            icon: stats.percentChange <= 0
                ? <TrendingDown className="w-3.5 h-3.5" />
                : <TrendingUp className="w-3.5 h-3.5" />,
        },
    ];

    return (
        <div className="w-full">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
                {isAllTimeLow && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-500 border border-orange-500/20 shadow-sm animate-pulse">
                        <Flame className="w-3 h-3" />
                        All-Time Low
                    </span>
                )}
                {isAllTimeHigh && !isAllTimeLow && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/20">
                        <TrendingUp className="w-3 h-3" />
                        All-Time High
                    </span>
                )}
                {savings > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">
                        💰 You save {currency} {savings.toFixed(2)}
                    </span>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className={`${item.bg} ${item.borderColor} border rounded-2xl px-3 py-4 text-center transition-transform hover:scale-105 duration-300`}
                    >
                        <div className={`flex items-center justify-center gap-1 ${item.color} mb-1 opacity-70`}>
                            {item.icon}
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                {item.label}
                            </span>
                        </div>
                        <div className={`text-base font-black ${item.color}`}>
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tracking info */}
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/40 mt-4 text-right">
                {stats.totalEntries} sessions • Since{" "}
                {new Date(stats.firstTracked).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                })}
            </p>
        </div>
    );
}
