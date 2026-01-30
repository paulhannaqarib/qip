"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type Row = {
    name: string;
    value: number;
    total: number;
};

const data: Row[] = [
    { name: "Categories", value: 4, total: 7 },
    { name: "Interests", value: 10, total: 10 },
    { name: "Municipalities", value: 0, total: 0 },
];

export default function EntityOverview() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-base font-semibold text-slate-900">
                    Entity Overview
                </div>
            </div>

            {/* Chart */}
            <div className="h-[320px] px-6 py-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                        barCategoryGap={18}
                    >
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            width={120}
                        />
                        <Tooltip />

                        {/* Gray background bar (total) */}
                        <Bar dataKey="total" radius={[10, 10, 10, 10]} fill="#e8eef6" />

                        {/* Green active bar (value) */}
                        <Bar dataKey="value" radius={[10, 10, 10, 10]} fill="#22c55e" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
