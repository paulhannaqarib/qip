"use client";

import type { Interest } from "@/lib/interests";
import type { Category } from "@/lib/categories";
import InterestRowMenu from "@/components/interests/InterestRowMenu";
import { Tag } from "lucide-react";

function StatusPill({ status }: { status: Interest["status"] }) {
    const active = status === "active";
    return (
        <span
            className={
                active
                    ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                    : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
            }
        >
      {active ? "Active" : "Inactive"}
    </span>
    );
}

function CategoryChip({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {label}
    </span>
    );
}

export default function InterestsTable({
                                           items,
                                           totalCount,
                                           categoriesById,

                                           selectedIds,
                                           onToggleAllOnPage,
                                           onToggleOne,

                                           onEdit,
                                           onToggleStatus,
                                           onDelete,
                                       }: {
    items: Interest[];
    totalCount: number;
    categoriesById: Record<string, Category | undefined>;

    selectedIds: Set<string>;
    onToggleAllOnPage: () => void;
    onToggleOne: (id: string) => void;

    onEdit: (i: Interest) => void;
    onToggleStatus: (i: Interest) => void;
    onDelete: (i: Interest) => void;
}) {
    const allOnPageSelected = items.length > 0 && items.every((i) => selectedIds.has(i.id));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
                <Tag size={18} className="text-slate-600" />
                <div className="text-base font-semibold text-slate-900">All Interests ({totalCount})</div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-b-2xl">
                <div className="grid grid-cols-12 border-b border-slate-200 bg-[#f8fbff] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    <div className="col-span-1 flex items-center">
                        <input
                            type="checkbox"
                            checked={allOnPageSelected}
                            onChange={onToggleAllOnPage}
                            className="h-4 w-4 rounded border-slate-300"
                            aria-label="Select all"
                        />
                    </div>

                    <div className="col-span-4">Name</div>
                    <div className="col-span-3">Name (Arabic)</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {items.map((i) => {
                        const cat = categoriesById[i.categoryId];
                        const catLabel = cat?.nameEn ?? "—";

                        return (
                            <div
                                key={i.id}
                                className="grid grid-cols-12 items-center px-6 py-4 transition hover:bg-[#f6fbff]"
                            >
                                <div className="col-span-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(i.id)}
                                        onChange={() => onToggleOne(i.id)}
                                        className="h-4 w-4 rounded border-slate-300"
                                        aria-label={`Select ${i.nameEn}`}
                                    />
                                </div>

                                <div className="col-span-4 text-sm font-semibold text-slate-900">{i.nameEn}</div>

                                <div className="col-span-3 text-sm text-slate-700">{i.nameAr || ""}</div>

                                <div className="col-span-2">
                                    <CategoryChip label={catLabel} />
                                </div>

                                <div className="col-span-1 flex justify-center">
                                    <StatusPill status={i.status} />
                                </div>

                                <div className="col-span-1 flex justify-end">
                                    <InterestRowMenu
                                        interest={i}
                                        onEdit={onEdit}
                                        onToggleStatus={onToggleStatus}
                                        onDelete={onDelete}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
