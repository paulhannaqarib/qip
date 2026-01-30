"use client";

import { useState } from "react";
import { ChevronDown, Check, CreditCard } from "lucide-react";

export type PlanFilter = "all" | "basic" | "standard" | "premium";

export default function PlanFilterDropdown({
                                               value,
                                               onChange,
                                           }: {
    value: PlanFilter;
    onChange: (v: PlanFilter) => void;
}) {
    const [open, setOpen] = useState(false);

    const options: { value: PlanFilter; label: string }[] = [
        { value: "all", label: "All Plans" },
        { value: "basic", label: "Basic" },
        { value: "standard", label: "Standard" },
        { value: "premium", label: "Premium" },
    ];

    const current = options.find((o) => o.value === value)?.label ?? "All Plans";

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
                <CreditCard size={16} className="text-slate-400" />
                {current}
                <ChevronDown size={16} className="ml-1 text-slate-400" />
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 z-50 mt-2 w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
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
