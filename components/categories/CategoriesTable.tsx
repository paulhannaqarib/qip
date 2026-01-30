"use client";

import type { Category } from "@/lib/categories";
import CategoryRowMenu from "@/components/categories/CategoryRowMenu";
import { List } from "lucide-react";

export default function CategoriesTable({
                                            items,
                                            totalCount,
                                            selectedIds,
                                            onToggleAllOnPage,
                                            onToggleOne,
                                            onEdit,
                                            onToggleStatus,
                                            onDelete,
                                        }: {
    items: Category[];
    totalCount: number;
    selectedIds: Set<string>;
    onToggleAllOnPage: () => void;
    onToggleOne: (id: string) => void;
    onEdit: (c: Category) => void;
    onToggleStatus: (c: Category) => void;
    onDelete: (c: Category) => void;
}) {
    const allOnPageSelected = items.length > 0 && items.every((c) => selectedIds.has(c.id));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
                <List size={18} className="text-slate-600" />
                <div className="text-base font-semibold text-slate-900">All Categories ({totalCount})</div>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-b-2xl">
                {/* ===== TABLE HEADER (ORDER IS CRITICAL) ===== */}
                <div className="grid grid-cols-12 border-b border-slate-200 bg-[#f8fbff] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    <div className="col-span-1">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300"
                            checked={allOnPageSelected}
                            onChange={onToggleAllOnPage}
                            aria-label="Select all categories on page"
                        />
                    </div>

                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Name (Arabic)</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">Actions</div>
                </div>

                {/* ===== TABLE ROWS ===== */}
                <div className="divide-y divide-slate-100">
                    {items.map((c) => (
                        <div key={c.id} className="grid grid-cols-12 items-center px-6 py-3 hover:bg-[#f6fbff]">
                            {/* checkbox */}
                            <div className="col-span-1">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300"
                                    checked={selectedIds.has(c.id)}
                                    onChange={() => onToggleOne(c.id)}
                                    aria-label={`Select ${c.nameEn}`}
                                />
                            </div>

                            {/* name */}
                            <div className="col-span-3 text-sm font-semibold text-slate-900">{c.nameEn}</div>

                            {/* arabic */}
                            <div className="col-span-3 text-sm text-slate-700">{c.nameAr}</div>

                            {/* description */}
                            <div className="col-span-3 text-sm text-slate-600">{c.description}</div>

                            {/* status */}
                            <div className="col-span-1 flex justify-center">
                <span
                    className={
                        c.status === "active"
                            ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                            : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    }
                >
                  {c.status === "active" ? "Active" : "Inactive"}
                </span>
                            </div>

                            {/* actions */}
                            <div className="col-span-1 flex justify-center">
                                <CategoryRowMenu
                                    category={c}
                                    onEdit={onEdit}
                                    onToggleStatus={onToggleStatus}
                                    onDelete={onDelete}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
