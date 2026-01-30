"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Category } from "@/lib/categories";

export default function CategoryModal({
                                          open,
                                          mode,
                                          initial,
                                          onClose,
                                          onCreate,
                                          onUpdate,
                                      }: {
    open: boolean;
    mode: "create" | "edit";
    initial: Category | null;
    onClose: () => void;
    onCreate: (payload: Omit<Category, "id" | "status">) => void;
    onUpdate: (payload: Omit<Category, "id" | "status">) => void;
}) {
    const title = mode === "create" ? "Add New Category" : "Edit Category";
    const subtitle =
        mode === "create"
            ? "Fill in the details to create a new category."
            : "Update the category details below.";

    const [nameEn, setNameEn] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("");

    useEffect(() => {
        if (!open) return;
        setNameEn(initial?.nameEn ?? "");
        setNameAr(initial?.nameAr ?? "");
        setDescription(initial?.description ?? "");
        setIcon(initial?.icon ?? "");
    }, [open, initial]);

    const canSubmit = useMemo(() => nameEn.trim().length > 0, [nameEn]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* modal */}
            <div className="absolute left-1/2 top-1/2 w-[520px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between px-6 pt-6">
                    <div>
                        <div className="text-lg font-semibold text-slate-900">{title}</div>
                        <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 pb-2 pt-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Name (English) <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={nameEn}
                            onChange={(e) => setNameEn(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Name (Arabic)
                        </label>
                        <input
                            value={nameAr}
                            onChange={(e) => setNameAr(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Description
                        </label>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Icon (lucide icon name)
                        </label>
                        <input
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            placeholder="e.g., newspaper, trophy, heart"
                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-300"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 pb-6 pt-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!canSubmit}
                        onClick={() => {
                            const payload = {
                                nameEn: nameEn.trim(),
                                nameAr: nameAr.trim(),
                                description: description.trim(),
                                icon: icon.trim(),
                            };
                            if (mode === "create") onCreate(payload);
                            else onUpdate(payload);
                        }}
                        className="rounded-lg bg-[#23235b] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                    >
                        {mode === "create" ? "Create" : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}
