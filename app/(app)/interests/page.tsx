"use client";

import { useMemo, useState } from "react";
import type { Category } from "@/lib/categories";
import type { Interest } from "@/lib/interests";
import { makeId, nowIso } from "@/lib/interests";
import InterestsTable from "@/components/interests/InterestsTable";
import CategoryFilterDropdown from "@/components/interests/CategoryFilterDropdown";
import AddInterestModal from "@/components/interests/AddInterestModal";
import EditInterestModal from "@/components/interests/EditInterestModal";
import DeleteInterestModal from "@/components/interests/DeleteInterestModal";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

/**
 * IMPORTANT:
 * Replace the mock data with your real API fetch if you already have one.
 * The UI/UX and state flow remains identical.
 */

const MOCK_CATEGORIES: Category[] = [
    { id: "cat_news", nameEn: "News & Updates", nameAr: "الأخبار والتحديثات", description: "", status: "inactive", icon: "newspaper" },
    { id: "cat_sports", nameEn: "Sports & Recreation", nameAr: "الرياضة والترفيه", description: "", status: "inactive", icon: "trophy" },
    { id: "cat_culture", nameEn: "Culture & Arts", nameAr: "الثقافة والفنون", description: "", status: "active", icon: "palette" },
    { id: "cat_health", nameEn: "Health & Safety", nameAr: "الصحة والسلامة", description: "", status: "active", icon: "heart" },
    { id: "cat_env", nameEn: "Environment", nameAr: "البيئة", description: "", status: "active", icon: "leaf" },
];

const MOCK_INTERESTS: Interest[] = [
    { id: "int_1", nameEn: "Local Events", nameAr: "الفعاليات المحلية", categoryId: "cat_news", description: "", status: "active", createdAt: nowIso(), updatedAt: nowIso() },
    { id: "int_2", nameEn: "Government Announcements", nameAr: "الإعلانات الحكومية", categoryId: "cat_news", description: "", status: "active", createdAt: nowIso(), updatedAt: nowIso() },
    { id: "int_3", nameEn: "Football", nameAr: "كرة القدم", categoryId: "cat_sports", description: "", status: "active", createdAt: nowIso(), updatedAt: nowIso() },
    { id: "int_4", nameEn: "Basketball", nameAr: "كرة السلة", categoryId: "cat_sports", description: "", status: "active", createdAt: nowIso(), updatedAt: nowIso() },
    { id: "int_5", nameEn: "Museums", nameAr: "المتاحف", categoryId: "cat_culture", description: "", status: "active", createdAt: nowIso(), updatedAt: nowIso() },
];

export default function InterestsPage() {
    const [categories] = useState<Category[]>(MOCK_CATEGORIES);
    const [items, setItems] = useState<Interest[]>(MOCK_INTERESTS);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [editing, setEditing] = useState<Interest | null>(null);
    const [deleting, setDeleting] = useState<Interest | null>(null);

    const categoriesById = useMemo(() => {
        const m: Record<string, Category> = {};
        categories.forEach((c) => (m[c.id] = c));
        return m;
    }, [categories]);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();

        return items
            .filter((i) => (categoryFilter === "all" ? true : i.categoryId === categoryFilter))
            .filter((i) => {
                if (!s) return true;
                return (
                    i.nameEn.toLowerCase().includes(s) ||
                    (i.nameAr || "").toLowerCase().includes(s) ||
                    (categoriesById[i.categoryId]?.nameEn || "").toLowerCase().includes(s)
                );
            });
    }, [items, search, categoryFilter, categoriesById]);

    const selectedCount = selectedIds.size;

    function toggleOne(id: string) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleAllOnPage() {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            const allSelected = filtered.length > 0 && filtered.every((x) => next.has(x.id));
            if (allSelected) {
                // unselect all on current page
                filtered.forEach((x) => next.delete(x.id));
            } else {
                // select all on current page
                filtered.forEach((x) => next.add(x.id));
            }
            return next;
        });
    }

    function clearSelection() {
        setSelectedIds(new Set());
    }

    // --------- Single row actions ----------
    async function onToggleStatus(i: Interest) {
        setItems((prev) =>
            prev.map((x) =>
                x.id === i.id
                    ? { ...x, status: x.status === "active" ? "inactive" : "active", updatedAt: nowIso() }
                    : x
            )
        );

        if (i.status === "active") toast.success("Interest inactivated");
        else toast.success("Interest activated");
    }

    async function onEdit(i: Interest) {
        setEditing(i);
        setEditOpen(true);
    }

    async function onDelete(i: Interest) {
        setDeleting(i);
        setDeleteOpen(true);
    }

    // --------- Bulk actions ----------
    async function bulkActivate() {
        if (!selectedCount) return;
        setItems((prev) =>
            prev.map((x) => (selectedIds.has(x.id) ? { ...x, status: "active", updatedAt: nowIso() } : x))
        );
        toast.success("Interest activated");
        clearSelection();
    }

    async function bulkDeactivate() {
        if (!selectedCount) return;
        setItems((prev) =>
            prev.map((x) =>
                selectedIds.has(x.id) ? { ...x, status: "inactive", updatedAt: nowIso() } : x
            )
        );
        toast.success("Interest inactivated");
        clearSelection();
    }

    async function bulkDelete() {
        if (!selectedCount) return;
        // optional: show one confirmation modal for bulk delete; for now direct delete:
        setItems((prev) => prev.filter((x) => !selectedIds.has(x.id)));
        toast.success("Interest deleted successfully");
        clearSelection();
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-3xl font-bold text-slate-900">Interests</div>
                    <div className="mt-1 text-sm text-slate-500">Manage user interests linked to categories</div>
                </div>

                <button
                    onClick={() => setAddOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800"
                >
                    <Plus size={16} />
                    Add Interest
                </button>
            </div>

            {/* Controls row (search + filter + bulk actions like screenshot) */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                {/* Search */}
                <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search interests..."
                        className="w-full bg-transparent outline-none"
                    />
                </div>

                {/* Filter */}
                <CategoryFilterDropdown
                    categories={categories}
                    value={categoryFilter}
                    onChange={(v) => setCategoryFilter(v)}
                />

                {/* Bulk buttons */}
                {selectedCount > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-slate-600">{selectedCount} selected</div>

                        <button
                            onClick={bulkActivate}
                            className="rounded-lg border border-green-400 bg-white px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                        >
                            Activate
                        </button>

                        <button
                            onClick={bulkDeactivate}
                            className="rounded-lg border border-orange-400 bg-white px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50"
                        >
                            Deactivate
                        </button>

                        <button
                            onClick={bulkDelete}
                            className="rounded-lg border border-red-400 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="mt-6">
                <InterestsTable
                    items={filtered}
                    totalCount={filtered.length}
                    categoriesById={categoriesById}
                    selectedIds={selectedIds}
                    onToggleAllOnPage={toggleAllOnPage}
                    onToggleOne={toggleOne}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                />
            </div>

            {/* Modals */}
            <AddInterestModal
                open={addOpen}
                categories={categories}
                onClose={() => setAddOpen(false)}
                onCreate={async (input) => {
                    const newItem: Interest = {
                        id: makeId("int"),
                        nameEn: input.nameEn,
                        nameAr: input.nameAr,
                        description: input.description,
                        categoryId: input.categoryId,
                        status: "active", // or default inactive if you want
                        createdAt: nowIso(),
                        updatedAt: nowIso(),
                    };

                    setItems((prev) => [newItem, ...prev]);
                    setAddOpen(false);
                    toast.success("Interest created successfully");
                }}
            />

            <EditInterestModal
                open={editOpen}
                interest={editing}
                categories={categories}
                onClose={() => {
                    setEditOpen(false);
                    setEditing(null);
                }}
                onUpdate={async (id, input) => {
                    setItems((prev) =>
                        prev.map((x) =>
                            x.id === id
                                ? {
                                    ...x,
                                    nameEn: input.nameEn,
                                    nameAr: input.nameAr,
                                    description: input.description,
                                    categoryId: input.categoryId,
                                    updatedAt: nowIso(),
                                }
                                : x
                        )
                    );

                    setEditOpen(false);
                    setEditing(null);
                    toast.success("Interest updated successfully");
                }}
            />

            <DeleteInterestModal
                open={deleteOpen}
                interestName={deleting?.nameEn || "this interest"}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeleting(null);
                }}
                onConfirm={async () => {
                    if (!deleting) return;
                    setItems((prev) => prev.filter((x) => x.id !== deleting.id));
                    setDeleteOpen(false);
                    setDeleting(null);
                    toast.success("Interest deleted successfully");
                }}
            />
        </div>
    );
}
