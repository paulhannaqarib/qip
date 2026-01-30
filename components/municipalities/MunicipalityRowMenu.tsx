"use client";

import { useEffect, useRef, useState } from "react";
import type { Municipality } from "@/lib/municipalities";
import {
    CheckCircle2,
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
    XCircle,
} from "lucide-react";

export default function MunicipalityRowMenu({
                                                municipality,
                                                onView,
                                                onEdit,
                                                onToggleStatus,
                                                onDelete,
                                            }: {
    municipality: Municipality;
    onView: (m: Municipality) => void;
    onEdit: (m: Municipality) => void;
    onToggleStatus: (m: Municipality) => void;
    onDelete: (m: Municipality) => void;
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
                <div className="absolute right-0 top-9 z-50 w-48 rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onView(municipality);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        <Eye size={16} />
                        View Details
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setOpen(false);
                            onEdit(municipality);
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
                            onToggleStatus(municipality);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        {municipality.status === "active" ? (
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
                            onDelete(municipality);
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
