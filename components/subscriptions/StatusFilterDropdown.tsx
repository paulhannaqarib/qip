"use client";

import { useState } from "react";
import { ChevronDown, Check, Filter } from "lucide-react";

export type SubStatusFilter = "all" | "active" | "paused" | "cancelled" | "none";

export default function StatusFilterDropdown({
                                                 value,
                                                 onChange,
                                             }: {
    value: SubStatusFilter;
    onChange: (v: SubStatusFilter) => void;
}) {
    const [open, setOpen] = useState(false);

    const options: { value: SubStatusFilter; label: string }[] = [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
        { value: "cancelled", label: "Cancelled" },
        { value: "none", label: "No Subscription" },
    ];

    const current = options.find((o) => o.value === value)?.label ?? "All Statuses";

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
                <Filter size={16} className="text-slate-400" />
                {current}
                <ChevronDown size={16} className="ml-1 text-slate-400" />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 z-50 mt-2 w-[220px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                        {options.map((o) => {
                            const active = o.value === value;
                            return (
                                <button
                                    key={o.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(o.value);
                                        setOpen(false);
                                    }}
                                    className={[
                                        "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
                                        active ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <span>{o.label}</span>
                                    {active ? <Check size={16} className="text-slate-700" /> : null}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
