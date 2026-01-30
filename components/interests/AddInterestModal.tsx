"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/lib/categories";
import type { CreateInterestInput } from "@/lib/interests";

export default function AddInterestModal({
                                             open,
                                             categories,
                                             onClose,
                                             onCreate,
                                         }: {
    open: boolean;
    categories: Category[];
    onClose: () => void;
    onCreate: (input: CreateInterestInput) => void | Promise<void>;
}) {
    const [nameEn, setNameEn] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");

    const canCreate = useMemo(() => nameEn.trim().length > 0 && categoryId.trim().length > 0, [
        nameEn,
        categoryId,
    ]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative w-[560px] max-w-[92vw] rounded-2xl bg-white p-8 shadow-2xl">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-xl font-semibold text-slate-900">Add New Interest</div>
                        <div className="mt-1 text-sm text-slate-500">
                            Fill in the details to create a new interest.
                        </div>
                    </div>

                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        ✕
                    </button>
                </div>

                <div className="mt-6 space-y-5">
                    <div>
                        <label className="text-sm font-semibold text-slate-800">Name (English) *</label>
                        <input
                            value={nameEn}
                            onChange={(e) => setNameEn(e.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-800">Name (Arabic)</label>
                        <input
                            value={nameAr}
                            onChange={(e) => setNameAr(e.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-800">Category *</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400"
                        >
                            <option value="">Select a category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nameEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-800">Description</label>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!canCreate}
                        onClick={async () => {
                            await onCreate({
                                nameEn: nameEn.trim(),
                                nameAr: nameAr.trim() || undefined,
                                categoryId,
                                description: description.trim() || undefined,
                            });
                        }}
                        className={`h-11 rounded-xl px-6 text-sm font-semibold text-white ${
                            canCreate ? "bg-indigo-900 hover:bg-indigo-800" : "bg-indigo-200"
                        }`}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
