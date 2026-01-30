"use client";

import { Building2, Eye } from "lucide-react";

function PlanPill({ label }: { label: string }) {
    if (label === "-" || !label) {
        return <span className="text-sm text-slate-400">-</span>;
    }
    return (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {label}
    </span>
    );
}

function StatusPill({
                        status,
                        planLabel,
                    }: {
    status: "active" | "paused" | "cancelled" | "none";
    planLabel: string;
}) {
    // ✅ Match your screenshot behavior:
    // - active => show plan name in green
    // - paused => Paused (orange)
    // - cancelled => Cancelled (red)
    // - none => No Subscription (grey)
    if (status === "active") {
        return (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        {planLabel === "-" ? "Active" : planLabel}
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

function AccountStatusPill({ status }: { status: "active" | "inactive" }) {
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

export default function SubscriptionsTable({
                                               items,
                                               totalCount,
                                               onManage,
                                               getPlanLabel,
                                               getSubStatus,
                                           }: {
    items: any[];
    totalCount: number;
    onManage: (m: any) => void;
    getPlanLabel: (m: any) => string;
    getSubStatus: (m: any) => "active" | "paused" | "cancelled" | "none";
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
                <Building2 size={18} className="text-green-600" />
                <div className="text-base font-semibold text-slate-900">All Subscriptions ({totalCount})</div>
            </div>

            <div className="overflow-hidden rounded-b-2xl">
                <div className="grid grid-cols-12 border-b border-slate-200 bg-[#f8fbff] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    <div className="col-span-4">Municipality</div>
                    <div className="col-span-2">Region</div>
                    <div className="col-span-2">Plan</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-center">Account Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {items.map((m) => {
                        const plan = getPlanLabel(m);
                        const subStatus = getSubStatus(m);
                        const accountStatus = (String(m?.status || "inactive").toLowerCase() === "active"
                            ? "active"
                            : "inactive") as "active" | "inactive";

                        return (
                            <div key={m.id} className="grid grid-cols-12 items-center px-6 py-4">
                                {/* Municipality */}
                                <div className="col-span-4">
                                    <div className="text-sm font-semibold text-slate-900">{m.nameEn}</div>
                                    <div className="text-xs text-slate-500">{m.contactEmail}</div>
                                </div>

                                {/* Region */}
                                <div className="col-span-2 text-sm text-slate-700">{m.region || "-"}</div>

                                {/* Plan */}
                                <div className="col-span-2">
                                    <PlanPill label={plan} />
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <StatusPill status={subStatus} planLabel={plan} />
                                </div>

                                {/* Account Status */}
                                <div className="col-span-1 flex justify-center">
                                    <AccountStatusPill status={accountStatus} />
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex justify-end">
                                    <button
                                        onClick={() => onManage(m)}
                                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                    >

                                    <Eye size={16} className="text-slate-500" />
                                        Manage
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {items.length === 0 && (
                        <div className="px-6 py-10 text-sm text-slate-500">No subscriptions match your filters.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
