"use client";

import { useEffect, useRef, useState } from "react";
import type { Interest } from "@/lib/interests";
import { MoreHorizontal, Pencil, CheckCircle2, XCircle, Trash2 } from "lucide-react";

export default function InterestRowMenu({
                                            interest,
                                            onEdit,
                                            onToggleStatus,
                                            onDelete,
                                        }: {
    interest: Interest;
    onEdit: (i: Interest) => void;
    onToggleStatus: (i: Interest) => void;
    onDelete: (i: Interest) => void;
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

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((s) => !s)}
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
                aria-label="Open actions"
            >
                <MoreHorizontal size={18} />
            </button>

            {open && (
                <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onEdit(interest);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        <Pencil size={16} />
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onToggleStatus(interest);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        {interest.status === "active" ? (
                            <>
                                <XCircle size={16} />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={16} />
                                Activate
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onDelete(interest);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
