"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    PauseCircle,
    XCircle,
    LayoutGrid,
    SlidersHorizontal,
    CreditCard,
} from "lucide-react";

import type { Municipality } from "@/lib/municipalities";
import { nowIso } from "@/lib/municipalities";

import StatusFilterDropdown, { SubStatusFilter } from "@/components/subscriptions/StatusFilterDropdown";
import PlanFilterDropdown, { PlanFilter } from "@/components/subscriptions/PlanFilterDropdown";
import SubscriptionsTable from "@/components/subscriptions/SubscriptionsTable";

type PlanId = "basic" | "standard" | "premium";

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

function planLabel(planId?: string | null) {
    const p = (planId || "").toLowerCase();
    if (p === "basic") return "Basic";
    if (p === "standard") return "Standard";
    if (p === "premium") return "Premium";
    return "-";
}

function normalizeSubStatus(m: any): "active" | "paused" | "cancelled" | "none" {
    const s = String(m?.subscriptionStatus || "none").toLowerCase();
    if (s === "active" || s === "paused" || s === "cancelled") return s;
    return "none";
}

export default function SubscriptionsClient() {
    const router = useRouter();

    const [items, setItems] = useState<Municipality[]>(MOCK_MUNICIPALITIES);

    // ✅ Rehydrate from sessionStorage (same key used by Municipality details page)
    useEffect(() => {
        setItems((prev) => {
            let changed = false;
            const next = prev.map((m) => {
                try {
                    const raw = sessionStorage.getItem(`municipality:update:${m.id}`);
                    if (!raw) return m;
                    const updated = JSON.parse(raw);
                    changed = true;
                    return { ...m, ...updated };
                } catch {
                    return m;
                }
            });
            return changed ? next : prev;
        });
    }, []);

    const [statusFilter, setStatusFilter] = useState<SubStatusFilter>("all");
    const [planFilter, setPlanFilter] = useState<PlanFilter>("all");

    // KPI counts (based on subscriptionStatus only)
    const stats = useMemo(() => {
        const all = items.length;

        let active = 0;
        let paused = 0;
        let none = 0;

        for (const m of items as any[]) {
            const s = normalizeSubStatus(m);
            if (s === "active") active++;
            else if (s === "paused") paused++;
            else if (s === "none") none++;
            // cancelled is intentionally not a KPI card in your screenshot
        }

        return { all, active, paused, none };
    }, [items]);

    const filtered = useMemo(() => {
        return (items as any[]).filter((m) => {
            const s = normalizeSubStatus(m);

            if (statusFilter !== "all") {
                if (statusFilter === "none") {
                    if (s !== "none") return false;
                } else if (s !== statusFilter) return false;
            }

            if (planFilter !== "all") {
                const pid = String(m?.subscriptionPlanId || "").toLowerCase();
                if (pid !== planFilter) return false;
            }

            return true;
        });
    }, [items, statusFilter, planFilter]);

    return (
        <div>
            {/* Header */}
            <div>
                <div className="text-3xl font-bold text-slate-900">Subscriptions</div>
                <div className="mt-1 text-sm text-slate-500">Overview of all municipality subscriptions</div>
            </div>

            {/* KPI cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Total</div>
                            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.all}</div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                            <LayoutGrid className="text-slate-500" size={18} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Active</div>
                            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.active}</div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                            <CheckCircle2 className="text-green-600" size={18} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Paused</div>
                            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.paused}</div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                            <PauseCircle className="text-orange-600" size={18} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">No Subscription</div>
                            <div className="mt-1 text-2xl font-bold text-slate-900">{stats.none}</div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                            <XCircle className="text-slate-500" size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters bar */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">


                    <StatusFilterDropdown value={statusFilter} onChange={setStatusFilter} />
                    <PlanFilterDropdown value={planFilter} onChange={setPlanFilter} />
                </div>
            </div>

            {/* Table */}
            <div className="mt-6">
                <SubscriptionsTable
                    items={filtered as any[]}
                    totalCount={filtered.length}
                    onManage={(m) => router.push(`/municipalities/${m.id}`)} // Overview opens by default
                    getPlanLabel={(m) => planLabel(m?.subscriptionPlanId as PlanId | undefined)}
                    getSubStatus={(m) => normalizeSubStatus(m)}
                />
            </div>
        </div>
    );
}
