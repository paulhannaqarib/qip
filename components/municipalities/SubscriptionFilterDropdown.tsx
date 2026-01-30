"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, CreditCard } from "lucide-react";
import type { SubscriptionStatus } from "@/lib/municipalities";

const OPTIONS: { value: string; label: string }[] = [
    { value: "all", label: "All Subscriptions" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "cancelled", label: "Cancelled" },
    { value: "none", label: "No Subscription" },
];

export default function SubscriptionFilterDropdown({
                                                       value,
                                                       onChange,
                                                   }: {
    value: "all" | SubscriptionStatus;
    onChange: (next: "all" | SubscriptionStatus) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const label = OPTIONS.find((o) => o.value === value)?.label ?? "All Subscriptions";

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
                <CreditCard size={16} className="text-slate-500" />
                <span className="min-w-[170px] text-left">{label}</span>
                <ChevronDown size={16} className="text-slate-400" />
            </button>

            {open && (
                <div className="absolute left-0 top-12 z-50 w-[260px] rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                    {OPTIONS.map((o) => {
                        const active = o.value === value;
                        return (
                            <button
                                key={o.value}
                                type="button"
                                onClick={() => {
                                    onChange(o.value as any);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center justify-between px-4 py-2 text-sm ${
                                    active ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <span>{o.label}</span>
                                {active && <span>✓</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
