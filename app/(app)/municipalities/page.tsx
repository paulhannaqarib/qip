"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type { Municipality, SubscriptionStatus } from "@/lib/municipalities";
import { makeId, nowIso } from "@/lib/municipalities";

import MunicipalitiesTable from "@/components/municipalities/MunicipalitiesTable";
import RegionFilterDropdown from "@/components/municipalities/RegionFilterDropdown";
import SubscriptionFilterDropdown from "@/components/municipalities/SubscriptionFilterDropdown";
import AddMunicipalityModal from "@/components/municipalities/AddMunicipalityModal";
import DeleteMunicipalityModal from "@/components/municipalities/DeleteMunicipalityModal";
import EditMunicipalityModal from "@/components/municipalities/EditMunicipalityModal";

const MOCK_MUNICIPALITIES: Municipality[] = [
    {
        id: "mun_bsalim",
        nameEn: "Bsalim",
        nameAr: "",
        region: "Maten",
        country: "Lebanon",
        contactEmail: "bsalim@gmail.com",
        contactPhone: "048052369",
        population: 5000,
        categoryIds: [],
        interestIds: [],
        status: "inactive",
        subscriptionStatus: "cancelled",
        createdAt: nowIso(),
        updatedAt: nowIso(),
    },
];

function readMunicipalityUpdate(id: string): Partial<Municipality> & Record<string, any> {
    try {
        const raw = sessionStorage.getItem(`municipality:update:${id}`);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return {};
        return parsed;
    } catch {
        return {};
    }
}

function mergeLatest(m: Municipality): Municipality {
    const updated = readMunicipalityUpdate(m.id);
    // merge and keep base fields if update is missing something
    return { ...m, ...updated };
}

export default function MunicipalitiesPage() {
    const router = useRouter();

    const [items, setItems] = useState<Municipality[]>(MOCK_MUNICIPALITIES);

    // ✅ Rehydrate updated municipality objects from sessionStorage (including subscriptionPlan)
    useEffect(() => {
        setItems((prev) => {
            const next = prev.map(mergeLatest);
            return next;
        });
    }, []);

    // Controls
    const [search, setSearch] = useState("");
    const [regionFilter, setRegionFilter] = useState<string>("all");
    const [subscriptionFilter, setSubscriptionFilter] = useState<"all" | SubscriptionStatus>("all");

    // Selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Modals
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState<Municipality | null>(null);

    // ✅ EDIT MODAL
    const [editOpen, setEditOpen] = useState(false);
    const [editing, setEditing] = useState<Municipality | null>(null);

    const regions = useMemo(() => {
        const set = new Set<string>();
        items.forEach((m) => {
            const r = (m.region || "").trim();
            if (r) set.add(r);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [items]);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();

        return items
            .filter((m) => (regionFilter === "all" ? true : m.region === regionFilter))
            .filter((m) => (subscriptionFilter === "all" ? true : m.subscriptionStatus === subscriptionFilter))
            .filter((m) => {
                if (!s) return true;
                return (
                    m.nameEn.toLowerCase().includes(s) ||
                    (m.nameAr || "").toLowerCase().includes(s) ||
                    (m.region || "").toLowerCase().includes(s) ||
                    (m.country || "").toLowerCase().includes(s)
                );
            });
    }, [items, search, regionFilter, subscriptionFilter]);

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
            if (allSelected) filtered.forEach((x) => next.delete(x.id));
            else filtered.forEach((x) => next.add(x.id));
            return next;
        });
    }

    function clearSelection() {
        setSelectedIds(new Set());
    }

    // -------- Row Actions --------
    async function onView(m: Municipality) {
        // Always store the latest object (including subscriptionPlan)
        const latest = mergeLatest(m);

        try {
            sessionStorage.setItem(`municipality:view:${m.id}`, JSON.stringify(latest));
        } catch {}
        router.push(`/municipalities/${m.id}`);
    }

    // ✅ REAL EDIT
    async function onEdit(m: Municipality) {
        const latest = mergeLatest(m);
        setEditing(latest);
        setEditOpen(true);
    }

    async function onToggleStatus(m: Municipality) {
        setItems((prev) =>
            prev.map((x) =>
                x.id === m.id
                    ? {
                        ...mergeLatest(x), // ✅ keep any extra fields like subscriptionPlan
                        status: x.status === "active" ? "inactive" : "active",
                        updatedAt: nowIso(),
                    }
                    : x
            )
        );
        toast.success(m.status === "active" ? "Municipality deactivated" : "Municipality activated");
    }

    async function onDelete(m: Municipality) {
        setDeleting(m);
        setDeleteOpen(true);
    }

    // -------- Bulk Actions --------
    async function bulkActivate() {
        if (!selectedCount) return;
        setItems((prev) =>
            prev.map((x) =>
                selectedIds.has(x.id)
                    ? { ...mergeLatest(x), status: "active", updatedAt: nowIso() }
                    : x
            )
        );
        toast.success("Municipality activated");
        clearSelection();
    }

    async function bulkDeactivate() {
        if (!selectedCount) return;
        setItems((prev) =>
            prev.map((x) =>
                selectedIds.has(x.id)
                    ? { ...mergeLatest(x), status: "inactive", updatedAt: nowIso() }
                    : x
            )
        );
        toast.success("Municipality deactivated");
        clearSelection();
    }

    async function bulkDelete() {
        if (!selectedCount) return;
        setItems((prev) => prev.filter((x) => !selectedIds.has(x.id)));
        toast.success("Municipality deleted successfully");
        clearSelection();
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-3xl font-bold text-slate-900">Municipalities</div>
                    <div className="mt-1 text-sm text-slate-500">Manage municipality profiles and subscriptions</div>
                </div>

                <button
                    onClick={() => setAddOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800"
                >
                    <Plus size={16} />
                    Add Municipality
                </button>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                {/* Search */}
                <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm">
                    <Search size={16} className="text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search municipalities..."
                        className="w-full bg-transparent outline-none"
                    />
                </div>

                <RegionFilterDropdown regions={regions} value={regionFilter} onChange={setRegionFilter} />
                <SubscriptionFilterDropdown value={subscriptionFilter} onChange={setSubscriptionFilter} />

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
                <MunicipalitiesTable
                    items={filtered}
                    totalCount={filtered.length}
                    selectedIds={selectedIds}
                    onToggleAllOnPage={toggleAllOnPage}
                    onToggleOne={toggleOne}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                    onDelete={onDelete}
                />
            </div>

            {/* Modals */}
            <AddMunicipalityModal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onCreate={async (input) => {
                    const newItem: Municipality = {
                        id: makeId("mun"),
                        nameEn: input.nameEn,
                        nameAr: input.nameAr,
                        region: input.region,
                        country: input.country,
                        contactEmail: input.contactEmail,
                        contactPhone: input.contactPhone,
                        population: input.population,
                        categoryIds: [],
                        interestIds: [],
                        status: "active",
                        subscriptionStatus: "none",
                        createdAt: nowIso(),
                        updatedAt: nowIso(),
                    };

                    setItems((prev) => [newItem, ...prev]);
                    setAddOpen(false);
                    toast.success("Municipality created successfully");
                }}
            />

            <DeleteMunicipalityModal
                open={deleteOpen}
                municipalityName={deleting?.nameEn || "this municipality"}
                onClose={() => {
                    setDeleteOpen(false);
                    setDeleting(null);
                }}
                onConfirm={async () => {
                    if (!deleting) return;
                    setItems((prev) => prev.filter((x) => x.id !== deleting.id));
                    setDeleteOpen(false);
                    setDeleting(null);
                    toast.success("Municipality deleted successfully");
                }}
            />

            {/* ✅ Edit Modal */}
            <EditMunicipalityModal
                open={editOpen}
                municipality={editing}
                onClose={() => {
                    setEditOpen(false);
                    setEditing(null);
                }}
                onUpdate={(updated) => {
                    const next = { ...updated, updatedAt: nowIso() };

                    setItems((prev) => prev.map((x) => (x.id === next.id ? next : x)));

                    try {
                        sessionStorage.setItem(`municipality:update:${next.id}`, JSON.stringify(next));
                        sessionStorage.setItem(`municipality:view:${next.id}`, JSON.stringify(next));
                    } catch {}

                    toast.success("Municipality updated successfully");
                    setEditOpen(false);
                    setEditing(null);
                }}
            />
        </div>
    );
}
