"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import type { Category } from "@/lib/categories";
import { INITIAL_CATEGORIES } from "@/lib/categories";
import CategoriesTable from "@/components/categories/CategoriesTable";
import CategoryModal from "@/components/categories/CategoryModal";
import DeleteCategoryModal from "@/components/categories/DeleteCategoryModal";

type ModalMode = "create" | "edit";

export default function CategoriesClient() {
    const [query, setQuery] = useState("");
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

    // ✅ selection (lifted to page)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const selectedCount = selectedIds.size;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");
    const [editing, setEditing] = useState<Category | null>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState<Category | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter((c) => {
            return (
                c.nameEn.toLowerCase().includes(q) ||
                c.nameAr.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q)
            );
        });
    }, [query, categories]);

    function openCreate() {
        setModalMode("create");
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(cat: Category) {
        setModalMode("edit");
        setEditing(cat);
        setModalOpen(true);
    }

    function requestDelete(cat: Category) {
        setDeleting(cat);
        setDeleteOpen(true);
    }

    function toggleStatus(cat: Category) {
        setCategories((prev) =>
            prev.map((x) => (x.id === cat.id ? { ...x, status: x.status === "active" ? "inactive" : "active" } : x))
        );

        if (cat.status === "active") toast.success("Category Inactivated");
        else toast.success("Category Activated");
    }

    function onCreate(payload: Omit<Category, "id" | "status">) {
        const newCat: Category = {
            id: crypto.randomUUID(),
            status: "active",
            ...payload,
        };
        setCategories((prev) => [newCat, ...prev]);
        setModalOpen(false);
        toast.success("Category Created Successfully");
    }

    function onUpdate(payload: Omit<Category, "id" | "status">) {
        if (!editing) return;
        setCategories((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...payload } : x)));
        setModalOpen(false);
        toast.success("Category Updated Successfully");
    }

    function confirmDelete() {
        if (!deleting) return;
        setCategories((prev) => prev.filter((x) => x.id !== deleting.id));
        setDeleteOpen(false);
        toast.success("Category Deleted Successfully");

        // ✅ also clear selection if deleted was selected
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(deleting.id);
            return next;
        });
    }

    // ✅ selection handlers
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
            const allSelected = filtered.length > 0 && filtered.every((c) => next.has(c.id));
            if (allSelected) filtered.forEach((c) => next.delete(c.id));
            else filtered.forEach((c) => next.add(c.id));
            return next;
        });
    }

    function clearSelection() {
        setSelectedIds(new Set());
    }

    // ✅ bulk actions
    function bulkActivate() {
        if (!selectedCount) return;
        setCategories((prev) => prev.map((c) => (selectedIds.has(c.id) ? { ...c, status: "active" } : c)));
        toast.success("Category Activated");
        clearSelection();
    }

    function bulkDeactivate() {
        if (!selectedCount) return;
        setCategories((prev) => prev.map((c) => (selectedIds.has(c.id) ? { ...c, status: "inactive" } : c)));
        toast.success("Category Inactivated");
        clearSelection();
    }

    function bulkDelete() {
        if (!selectedCount) return;
        setCategories((prev) => prev.filter((c) => !selectedIds.has(c.id)));
        toast.success("Category Deleted Successfully");
        clearSelection();
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage content categories for news and announcements</p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#23235b] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            {/* Search bar card + bulk actions */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="relative w-[420px] max-w-full">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-300"
                        />
                    </div>

                    {/* ✅ show only when selection exists */}
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
            </div>

            {/* Table card */}
            <div className="mt-6">
                <CategoriesTable
                    items={filtered}
                    totalCount={filtered.length}
                    selectedIds={selectedIds}
                    onToggleAllOnPage={toggleAllOnPage}
                    onToggleOne={toggleOne}
                    onEdit={openEdit}
                    onToggleStatus={toggleStatus}
                    onDelete={requestDelete}
                />
            </div>

            {/* Create / Edit modal */}
            <CategoryModal
                open={modalOpen}
                mode={modalMode}
                initial={editing}
                onClose={() => setModalOpen(false)}
                onCreate={onCreate}
                onUpdate={onUpdate}
            />

            {/* Delete confirm modal */}
            <DeleteCategoryModal
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
