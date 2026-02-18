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
            color: "text-green-600",
            bg: "bg-green-50",
            borderColor: "border-green-200",
            icon: <ArrowDownRight className="w-3.5 h-3.5" />,
        },
        {
            label: "Highest Ever",
            value: `${currency} ${stats.highest}`,
            color: "text-red-500",
            bg: "bg-red-50",
            borderColor: "border-red-200",
            icon: <TrendingUp className="w-3.5 h-3.5" />,
        },
        {
            label: "Average",
            value: `${currency} ${stats.average}`,
            color: "text-blue-600",
            bg: "bg-blue-50",
            borderColor: "border-blue-200",
            icon: <Minus className="w-3.5 h-3.5" />,
        },
        {
            label: "Since Tracking",
            value: `${stats.percentChange > 0 ? "+" : ""}${stats.percentChange}%`,
            color: stats.percentChange <= 0 ? "text-green-600" : "text-red-500",
            bg: stats.percentChange <= 0 ? "bg-green-50" : "bg-red-50",
            borderColor: stats.percentChange <= 0 ? "border-green-200" : "border-red-200",
            icon: stats.percentChange <= 0
                ? <TrendingDown className="w-3.5 h-3.5" />
                : <TrendingUp className="w-3.5 h-3.5" />,
        },
    ];

    return (
        <div className="w-full mt-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
                {isAllTimeLow && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm">
                        <Flame className="w-3 h-3" />
                        All-Time Low!
                    </span>
                )}
                {isAllTimeHigh && !isAllTimeLow && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <TrendingUp className="w-3 h-3" />
                        All-Time High
                    </span>
                )}
                {savings > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        💰 You save {currency} {savings.toFixed(2)}
                    </span>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className={`${item.bg} ${item.borderColor} border rounded-lg px-3 py-2.5 text-center`}
                    >
                        <div className={`flex items-center justify-center gap-1 ${item.color} mb-1`}>
                            {item.icon}
                            <span className="text-[11px] font-medium uppercase tracking-wide">
                                {item.label}
                            </span>
                        </div>
                        <div className={`text-sm font-bold ${item.color}`}>
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tracking info */}
            <p className="text-[11px] text-gray-400 mt-2 text-right">
                {stats.totalEntries} price check{stats.totalEntries !== 1 ? "s" : ""} since{" "}
                {new Date(stats.firstTracked).toLocaleDateString()}
            </p>
        </div>
    );
}
