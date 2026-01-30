"use client";

import type { Municipality, SubscriptionStatus } from "@/lib/municipalities";
import MunicipalityRowMenu from "@/components/municipalities/MunicipalityRowMenu";
import { Building2 } from "lucide-react";

function StatusPill({ status }: { status: Municipality["status"] }) {
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

function planLabelFromId(planId?: string | null) {
    const id = (planId || "").toLowerCase().trim();
    if (id === "basic") return "Basic";
    if (id === "standard") return "Standard";
    if (id === "premium") return "Premium";
    return null;
}

function SubscriptionPill({ municipality }: { municipality: Municipality }) {
    const status = (municipality.subscriptionStatus || "none") as SubscriptionStatus;

    // ✅ Read what you store in /municipalities/[id]/page.tsx
    const planId = (municipality as any)?.subscriptionPlanId as string | undefined;
    const planLabel = planLabelFromId(planId);

    if (status === "active") {
        // ✅ REQUIRED: main page shows plan name when active
        return (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        {planLabel || "Active"}
      </span>
        );
    }

    if (status === "paused") {
        return (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        Paused
      </span>
        );
    }

    if (status === "cancelled") {
        return (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Cancelled
      </span>
        );
    }

    return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      No Subscription
    </span>
    );
}

function fmtPopulation(n: number) {
    try {
        return new Intl.NumberFormat().format(n);
    } catch {
        return String(n);
    }
}

export default function MunicipalitiesTable({
                                                items,
                                                totalCount,
                                                selectedIds,
                                                onToggleAllOnPage,
                                                onToggleOne,
                                                onView,
                                                onEdit,
                                                onToggleStatus,
                                                onDelete,
                                            }: {
    items: Municipality[];
    totalCount: number;
    selectedIds: Set<string>;
    onToggleAllOnPage: () => void;
    onToggleOne: (id: string) => void;
    onView: (m: Municipality) => void;
    onEdit: (m: Municipality) => void;
    onToggleStatus: (m: Municipality) => void;
    onDelete: (m: Municipality) => void;
}) {
    const allOnPageSelected = items.length > 0 && items.every((m) => selectedIds.has(m.id));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
                <Building2 size={18} className="text-slate-600" />
                <div className="text-base font-semibold text-slate-900">
                    All Municipalities ({totalCount})
                </div>
            </div>

            {/* ✅ IMPORTANT: overflow-visible so the Actions dropdown is not clipped */}
            <div className="rounded-b-2xl overflow-visible">
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

                    <div className="col-span-3">Name</div>
                    <div className="col-span-2">Region</div>
                    <div className="col-span-2">Population</div>
                    <div className="col-span-2">Subscription</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {items.map((m) => (
                        <div
                            key={m.id}
                            className="grid grid-cols-12 items-center px-6 py-4 transition hover:bg-[#f6fbff]"
                        >
                            <div className="col-span-1">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(m.id)}
                                    onChange={() => onToggleOne(m.id)}
                                    className="h-4 w-4 rounded border-slate-300"
                                    aria-label={`Select ${m.nameEn}`}
                                />
                            </div>

                            <div className="col-span-3 text-sm font-semibold text-slate-900">{m.nameEn}</div>
                            <div className="col-span-2 text-sm text-slate-700">{m.region}</div>
                            <div className="col-span-2 text-sm text-slate-700">{fmtPopulation(m.population)}</div>

                            <div className="col-span-2">
                                <SubscriptionPill municipality={m} />
                            </div>

                            <div className="col-span-1 flex justify-center">
                                <StatusPill status={m.status} />
                            </div>

                            <div className="col-span-1 flex justify-end">
                                <MunicipalityRowMenu
                                    municipality={m}
                                    onView={onView}
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
