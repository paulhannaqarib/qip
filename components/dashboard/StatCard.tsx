import { ReactNode } from "react";

type Props = {
    title: string;
    value: number | string;
    metaText: string; // e.g. "↗ 4 active"
    metaTone: "success" | "warning";
    icon: ReactNode;
};

export default function StatCard({
                                     title,
                                     value,
                                     metaText,
                                     metaTone,
                                     icon,
                                 }: Props) {
    const metaClass =
        metaTone === "success" ? "text-green-500" : "text-orange-500";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-xs font-semibold tracking-wide text-slate-500">
                        {title.toUpperCase()}
                    </div>

                    <div className="mt-2 text-3xl font-semibold text-slate-900">
                        {value}
                    </div>

                    <div className={`mt-2 text-sm ${metaClass}`}>{metaText}</div>
                </div>

                {/* Icon square on the right */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                    {icon}
                </div>
            </div>
        </div>
    );
}
