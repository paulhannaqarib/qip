"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ENTITY_TYPE_OPTIONS, type EntityType } from "@/lib/activity";
import { Check, ChevronDown, Filter } from "lucide-react";
import { cn } from "@/utils/cn";

export default function EntityTypeFilter({
                                             value,
                                             onChange,
                                         }: {
    value: EntityType;
    onChange: (v: EntityType) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    const selected = useMemo(
        () => ENTITY_TYPE_OPTIONS.find((x) => x.value === value),
        [value]
    );

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            {/* Filter button (exact pill style) */}
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className={cn(
                    "flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3",
                    "text-sm text-slate-700 shadow-sm transition",
                    "hover:border-slate-300 hover:bg-slate-50"
                )}
            >
                <Filter size={16} className="text-slate-400" />
                <span className="min-w-[140px] text-left">{selected?.label}</span>
                <ChevronDown size={16} className="ml-2 text-slate-400" />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className={cn(
                        "absolute left-0 top-[54px] z-50 w-[220px] rounded-xl border border-slate-200 bg-white",
                        "shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
                    )}
                >
                    <div className="py-2">
                        {ENTITY_TYPE_OPTIONS.map((opt) => {
                            const active = opt.value === value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between px-4 py-2 text-sm",
                                        "transition hover:bg-slate-50",
                                        active && "bg-slate-50"
                                    )}
                                >
                  <span className={cn(active ? "font-semibold text-slate-900" : "text-slate-700")}>
                    {opt.label}
                  </span>
                                    {active && <Check size={16} className="text-slate-700" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
