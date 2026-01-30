"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
    ArrowLeft,
    Building2,
    Mail,
    MapPin,
    Phone,
    Users,
    XCircle,
    CheckCircle2,
    PauseCircle,
    RefreshCw,
    Ban,
    CreditCard,
    CalendarDays,
    Clock,
    ChevronDown,
    Check,
    X,
} from "lucide-react";

import type { Municipality } from "@/lib/municipalities";
import { nowIso } from "@/lib/municipalities";

type TabKey = "overview" | "subscription" | "content";

type PlanId = "basic" | "standard" | "premium";
type BillingCycle = "monthly" | "yearly";

type Plan = {
    id: PlanId;
    name: string;
    priceMonthly: number;
    priceYearly: number;
    features: string[];
};

const PLANS: Plan[] = [
    {
        id: "basic",
        name: "Basic",
        priceMonthly: 500,
        priceYearly: 5000,
        features: ["Up to 50 news/month", "Up to 20 announcements/month", "Basic analytics"],
    },
    {
        id: "standard",
        name: "Standard",
        priceMonthly: 1000,
        priceYearly: 10000,
        features: ["Up to 200 news/month", "Up to 100 announcements/month", "Advanced analytics"],
    },
    {
        id: "premium",
        name: "Premium",
        priceMonthly: 2000,
        priceYearly: 20000,
        features: ["Unlimited news", "Unlimited announcements", "Full analytics suite"],
    },
];

function formatSubscriptionBadge(status?: string) {
    const s = (status || "none").toLowerCase();
    if (s === "active") return { label: "Active", tone: "green" as const, icon: <CheckCircle2 size={14} /> };
    if (s === "paused") return { label: "Paused", tone: "orange" as const, icon: <PauseCircle size={14} /> };
    if (s === "cancelled") return { label: "Cancelled", tone: "red" as const, icon: <XCircle size={14} /> };
    return { label: "None", tone: "neutral" as const, icon: null };
}

function formatMunicipalityStatusBadge(status?: string) {
    const s = (status || "inactive").toLowerCase();
    if (s === "active") return { label: "Active", tone: "green" as const };
    return { label: "Inactive", tone: "neutral" as const };
}

function Pill({
                  children,
                  tone = "neutral",
              }: {
    children: React.ReactNode;
    tone?: "neutral" | "green" | "red" | "orange";
}) {
    const cls =
        tone === "green"
            ? "bg-green-50 text-green-700 border-green-200"
            : tone === "red"
                ? "bg-red-50 text-red-700 border-red-200"
                : tone === "orange"
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-slate-50 text-slate-700 border-slate-200";

    return (
        <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${cls}`}>
      {children}
    </span>
    );
}

function Dropdown<T extends string>({
                                        label,
                                        value,
                                        options,
                                        onChange,
                                    }: {
    label: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (v: T) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div className="text-sm font-semibold text-slate-900">{label}</div>

            <div className="relative mt-2">
                <button
                    type="button"
                    onClick={() => setOpen((p) => !p)}
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50"
                >
                    <span>{options.find((o) => o.value === value)?.label ?? "Choose"}</span>
                    <ChevronDown size={16} className="text-slate-400" />
                </button>

                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                            {options.map((o) => {
                                const active = o.value === value;
                                return (
                                    <button
                                        type="button"
                                        key={o.value}
                                        onClick={() => {
                                            onChange(o.value);
                                            setOpen(false);
                                        }}
                                        className={[
                                            "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
                                            active ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50",
                                        ].join(" ")}
                                    >
                                        <span>{o.label}</span>
                                        {active ? <Check size={16} className="text-slate-700" /> : null}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function ModalShell({
                        open,
                        title,
                        subtitle,
                        children,
                        onClose,
                    }: {
    open: boolean;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-[760px] max-w-[92vw] rounded-2xl bg-white p-10 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="text-2xl font-bold text-slate-900">{title}</div>
                <div className="mt-1 text-sm text-slate-500">{subtitle}</div>

                <div className="mt-8">{children}</div>
            </div>
        </div>
    );
}

function addDaysIso(iso: string, days: number) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    d.setDate(d.getDate() + days);
    return d.toISOString();
}

function fmtDate(iso?: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function sar(n: number) {
    return `SAR ${n.toLocaleString()}`;
}

export default function MunicipalityDetailsPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const [tab, setTab] = useState<TabKey>("overview");
    const [mun, setMun] = useState<Municipality | null>(null);

    // Modals
    const [createOpen, setCreateOpen] = useState(false);
    const [changeOpen, setChangeOpen] = useState(false);

    // Create / Change form values
    const [selectedPlan, setSelectedPlan] = useState<PlanId>("basic");
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

    useEffect(() => {
        if (!id) return;

        try {
            const raw = sessionStorage.getItem(`municipality:view:${id}`);
            if (raw) {
                setMun(JSON.parse(raw));
                return;
            }
        } catch {}
        setMun(null);
    }, [id]);

    function persist(next: Municipality) {
        setMun(next);
        try {
            sessionStorage.setItem(`municipality:view:${next.id}`, JSON.stringify(next));
            // THIS is what the main list page will read to update the table
            sessionStorage.setItem(`municipality:update:${next.id}`, JSON.stringify(next));
        } catch {}
    }

    const statusBadge = useMemo(() => formatMunicipalityStatusBadge(mun?.status), [mun]);
    const subBadge = useMemo(() => formatSubscriptionBadge((mun as any)?.subscriptionStatus), [mun]);

    const subscriptionStatus = (((mun as any)?.subscriptionStatus || "none") as string).toLowerCase();

    const currentPlanId = ((mun as any)?.subscriptionPlanId as PlanId | undefined) ?? null;
    const currentPlan = currentPlanId ? PLANS.find((p) => p.id === currentPlanId) : null;

    const currentBilling = (((mun as any)?.billingCycle as BillingCycle | undefined) ?? "monthly") as BillingCycle;
    const startDateIso = ((mun as any)?.subscriptionStartDate as string | undefined) ?? null;
    const nextBillingIso = ((mun as any)?.nextBillingDate as string | undefined) ?? null;

    // show subscription card ONLY when active or paused
    const hasActiveSubscriptionUI = subscriptionStatus === "active" || subscriptionStatus === "paused";

    const planOptions = [
        { value: "basic" as PlanId, label: "Basic - SAR 500/mo" },
        { value: "standard" as PlanId, label: "Standard - SAR 1000/mo" },
        { value: "premium" as PlanId, label: "Premium - SAR 2000/mo" },
    ];

    const billingOptions = [
        { value: "monthly" as BillingCycle, label: "Monthly" },
        { value: "yearly" as BillingCycle, label: "Yearly (Save 17%)" },
    ];

    function createSubscription() {
        if (!mun) return;

        const start = nowIso();
        const nextBill = billingCycle === "monthly" ? addDaysIso(start, 30) : addDaysIso(start, 365);

        const next = { ...(mun as any) } as any;

        next.subscriptionStatus = "active";
        next.subscriptionPlanId = selectedPlan;
        next.billingCycle = billingCycle;
        next.subscriptionStartDate = start;
        next.nextBillingDate = nextBill;

        persist(next as Municipality);

        setCreateOpen(false);
        toast.success("Subscription created successfully");
    }

    function pauseSubscription() {
        if (!mun) return;
        if (subscriptionStatus !== "active") return;

        const next = { ...(mun as any) } as any;
        next.subscriptionStatus = "paused";
        persist(next as Municipality);
        toast.success("Subscription paused");
    }

    function resumeSubscription() {
        if (!mun) return;
        if (subscriptionStatus !== "paused") return;

        const next = { ...(mun as any) } as any;
        next.subscriptionStatus = "active";
        persist(next as Municipality);
        toast.success("Subscription resumed");
    }

    function cancelSubscription() {
        if (!mun) return;

        const next = { ...(mun as any) } as any;
        next.subscriptionStatus = "cancelled";

        // IMPORTANT: after cancel, we want the page to show "Create Subscription" again
        // So we clear plan + cycle + dates (like real cancel).
        delete next.subscriptionPlanId;
        delete next.billingCycle;
        delete next.subscriptionStartDate;
        delete next.nextBillingDate;

        persist(next as Municipality);
        toast.success("Subscription cancelled");
    }

    function confirmChangePlan() {
        if (!mun) return;
        if (!selectedPlan) return;

        const next = { ...(mun as any) } as any;
        next.subscriptionPlanId = selectedPlan;
        // keep billing cycle + dates as is
        persist(next as Municipality);

        setChangeOpen(false);
        toast.success("Plan updated successfully");
    }

    return (
        <div className="p-8">
            {/* Back */}
            <Link
                href="/municipalities"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
                <ArrowLeft size={16} />
                Back to Municipalities
            </Link>

            {/* Header */}
            <div className="mt-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <Building2 className="text-slate-700" size={22} />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">{mun?.nameEn || "Municipality"}</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Pill tone={statusBadge.tone}>{statusBadge.label}</Pill>

                    <Pill tone={subBadge.tone}>
            <span className="inline-flex items-center gap-2">
              {subBadge.icon}
                {subBadge.label}
            </span>
                    </Pill>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 inline-flex rounded-xl border border-slate-200 bg-white p-1">
                <button
                    onClick={() => setTab("overview")}
                    className={[
                        "rounded-lg px-4 py-2 text-sm font-semibold",
                        tab === "overview" ? "bg-slate-50 text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                >
                    Overview
                </button>
                <button
                    onClick={() => setTab("subscription")}
                    className={[
                        "rounded-lg px-4 py-2 text-sm font-semibold",
                        tab === "subscription" ? "bg-slate-50 text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                >
                    Subscription
                </button>
                <button
                    onClick={() => setTab("content")}
                    className={[
                        "rounded-lg px-4 py-2 text-sm font-semibold",
                        tab === "content" ? "bg-slate-50 text-slate-900 shadow-sm" : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                >
                    Content Settings
                </button>
            </div>

            {/* OVERVIEW */}
            {tab === "overview" && (
                <div className="mt-8">
                    {/* keep same width like screenshot (not stretched) */}
                    <div className="w-full max-w-[980px]">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-5">
                                <div className="text-lg font-semibold text-slate-900">Contact Information</div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-2">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                        <Mail size={18} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-wide text-slate-400">Email</div>
                                        <div className="text-sm text-slate-900">{mun?.contactEmail || "-"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                        <Phone size={18} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-wide text-slate-400">Phone</div>
                                        <div className="text-sm text-slate-900">{mun?.contactPhone || "-"}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                        <MapPin size={18} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-wide text-slate-400">Location</div>
                                        <div className="text-sm text-slate-900">
                                            {(mun?.region || "-") + (mun?.country ? `, ${mun.country}` : "")}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                        <Users size={18} className="text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase tracking-wide text-slate-400">Population</div>
                                        <div className="text-sm text-slate-900">
                                            {typeof mun?.population === "number" ? mun.population.toLocaleString() : "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SUBSCRIPTION */}
            {tab === "subscription" && (
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_520px]">
                    {/* LEFT */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-5">
                            <div className="text-lg font-semibold text-slate-900">Current Subscription</div>
                            <div className="mt-1 text-sm text-slate-500">
                                Manage subscription for news and announcements on Qarib.ai
                            </div>
                        </div>

                        {/* No active subscription */}
                        {!hasActiveSubscriptionUI && (
                            <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-10">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                                    <CreditCard size={30} className="text-slate-400" />
                                </div>
                                <div className="mt-5 text-sm text-slate-500">No active subscription</div>

                                <button
                                    onClick={() => {
                                        setSelectedPlan("basic");
                                        setBillingCycle("monthly");
                                        setCreateOpen(true);
                                    }}
                                    className="mt-5 h-11 rounded-xl bg-indigo-900 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800"
                                >
                                    Create Subscription
                                </button>
                            </div>
                        )}

                        {/* Active or Paused subscription */}
                        {hasActiveSubscriptionUI && currentPlan && (
                            <div className="px-6 py-6">
                                <div className="rounded-2xl bg-slate-50 px-6 py-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-sm text-slate-600">Current Plan</div>
                                            <div className="mt-1 text-2xl font-bold text-slate-900">{currentPlan.name}</div>
                                        </div>

                                        <div
                                            className={[
                                                "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold",
                                                subscriptionStatus === "active"
                                                    ? "border-green-200 bg-green-50 text-green-700"
                                                    : "border-orange-200 bg-orange-50 text-orange-700",
                                            ].join(" ")}
                                        >
                                            {subscriptionStatus === "active" ? <CheckCircle2 size={16} /> : <PauseCircle size={16} />}
                                            {subscriptionStatus === "active" ? "Active" : "Paused"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                                    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                                            <CalendarDays size={14} />
                                            Billing Cycle
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-slate-900">
                                            {currentBilling === "monthly" ? "Monthly" : "Yearly"}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                                            <CalendarDays size={14} />
                                            Start Date
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-slate-900">{fmtDate(startDateIso || undefined)}</div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                                        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
                                            <Clock size={14} />
                                            Next Billing
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-slate-900">{fmtDate(nextBillingIso || undefined)}</div>
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-slate-200 pt-5">
                                    <div className="flex flex-wrap items-center gap-3">
                                        {subscriptionStatus === "active" ? (
                                            <button
                                                onClick={pauseSubscription}
                                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-orange-300 bg-white px-5 text-sm font-semibold text-orange-700 hover:bg-orange-50"
                                            >
                                                <PauseCircle size={16} />
                                                Pause
                                            </button>
                                        ) : (
                                            <button
                                                onClick={resumeSubscription}
                                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-green-300 bg-white px-5 text-sm font-semibold text-green-700 hover:bg-green-50"
                                            >
                                                <CheckCircle2 size={16} />
                                                Resume
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                setSelectedPlan(currentPlan.id);
                                                setChangeOpen(true);
                                            }}
                                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-sky-300 bg-white px-5 text-sm font-semibold text-sky-700 hover:bg-sky-50"
                                        >
                                            <RefreshCw size={16} />
                                            Change Plan
                                        </button>

                                        <button
                                            onClick={cancelSubscription}
                                            className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-300 bg-white px-5 text-sm font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            <Ban size={16} />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-5">
                            <div className="text-lg font-semibold text-slate-900">Available Plans</div>
                        </div>

                        <div className="space-y-4 px-6 py-6">
                            {PLANS.map((p) => {
                                const isCurrent = hasActiveSubscriptionUI && currentPlanId === p.id;
                                return (
                                    <div
                                        key={p.id}
                                        className={[
                                            "rounded-2xl border bg-white p-5",
                                            isCurrent ? "border-indigo-900 bg-slate-50" : "border-slate-200",
                                        ].join(" ")}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-base font-semibold text-slate-900">{p.name}</div>
                                                <div className="mt-1 text-sm text-slate-600">
                                                    {sar(p.priceMonthly)}/mo or {sar(p.priceYearly)}/yr
                                                </div>
                                            </div>

                                            {isCurrent && (
                                                <span className="rounded-full bg-indigo-900 px-3 py-1 text-xs font-semibold text-white">
                          Current
                        </span>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            {p.features.map((f) => (
                                                <div key={f} className="flex items-start gap-2 text-sm text-slate-700">
                                                    <CheckCircle2 size={14} className="mt-0.5 text-green-600" />
                                                    <span>{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Create Modal */}
                    <ModalShell
                        open={createOpen}
                        title="Create Subscription"
                        subtitle="Select a plan to create a new subscription."
                        onClose={() => setCreateOpen(false)}
                    >
                        <div className="space-y-6">
                            <Dropdown label="Select Plan" value={selectedPlan} options={planOptions} onChange={setSelectedPlan} />
                            <Dropdown label="Billing Cycle" value={billingCycle} options={billingOptions} onChange={setBillingCycle} />

                            <div className="mt-10 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setCreateOpen(false)}
                                    className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createSubscription}
                                    className="h-11 rounded-xl bg-indigo-900 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </ModalShell>

                    {/* Change Plan Modal */}
                    <ModalShell
                        open={changeOpen}
                        title="Change Subscription Plan"
                        subtitle="Select a new plan for this subscription."
                        onClose={() => setChangeOpen(false)}
                    >
                        <div className="space-y-6">
                            <Dropdown label="Select Plan" value={selectedPlan} options={planOptions} onChange={setSelectedPlan} />

                            <div className="mt-10 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setChangeOpen(false)}
                                    className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmChangePlan}
                                    className="h-11 rounded-xl bg-indigo-900 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </ModalShell>
                </div>
            )}

            {/* CONTENT (later) */}
            {tab === "content" && (
                <div className="mt-8 w-full max-w-[980px]">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-6 py-5">
                            <div className="text-lg font-semibold text-slate-900">Content Settings</div>
                            <div className="mt-1 text-sm text-slate-500">We will develop this section later.</div>
                        </div>
                        <div className="px-6 py-6 text-sm text-slate-600">Coming soon.</div>
                    </div>
                </div>
            )}
        </div>
    );
}
