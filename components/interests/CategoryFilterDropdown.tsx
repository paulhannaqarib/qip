"use client";

import { useEffect, useRef, useState } from "react";
import type { Category } from "@/lib/categories";
import { ChevronDown, Filter } from "lucide-react";

export default function CategoryFilterDropdown({
                                                   categories,
                                                   value,
                                                   onChange,
                                               }: {
    categories: Category[];
    value: string; // "all" or categoryId
    onChange: (next: string) => void;
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

    const currentLabel =
        value === "all"
            ? "All Categories"
            : categories.find((c) => c.id === value)?.nameEn ?? "All Categories";

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
                <Filter size={16} className="text-slate-500" />
                <span className="min-w-[160px] text-left">{currentLabel}</span>
                <ChevronDown size={16} className="text-slate-400" />
            </button>

            {open && (
                <div className="absolute left-0 top-12 z-50 w-[260px] rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                    <button
                        type="button"
                        onClick={() => {
                            onChange("all");
                            setOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-2 text-sm ${
                            value === "all" ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                        <span>All Categories</span>
                        {value === "all" && <span>✓</span>}
                    </button>

                    <div className="max-h-72 overflow-auto py-1">
                        {categories.map((c) => {
                            const active = value === c.id;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => {
                                        onChange(c.id);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-4 py-2 text-sm ${
                                        active ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    <span>{c.nameEn}</span>
                                    {active && <span>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
