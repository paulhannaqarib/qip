import type { ActivityItem } from "@/lib/activity";
import {
    Activity,
    Trash2,
    Plus,
    Pencil,
    Pause,
    Play,
    Ban,
} from "lucide-react";
import { cn } from "@/utils/cn";

function actionBadge(kind: ActivityItem["actionKind"]) {
    // softer pills like screenshot
    switch (kind) {
        case "bulk_activate":
        case "bulk_deactivate":
            return "bg-indigo-100 text-indigo-800";
        case "bulk_delete":
            return "bg-red-100 text-red-600";
        case "delete":
            return "bg-red-100 text-red-600";
        case "create":
            return "bg-green-100 text-green-700";
        case "update":
            return "bg-sky-100 text-sky-700";
        case "pause_subscription":
            return "bg-orange-100 text-orange-700";
        case "resume_subscription":
            return "bg-green-100 text-green-700";
        case "cancel_subscription":
            return "bg-red-100 text-red-600";
        default:
            return "bg-slate-100 text-slate-700";
    }
}

function typeBadge(type: ActivityItem["type"]) {
    switch (type) {
        case "interest":
            return "bg-sky-100 text-sky-700";
        case "category":
            return "bg-violet-100 text-violet-700";
        case "municipality":
            return "bg-emerald-100 text-emerald-700";
        case "subscription":
            return "bg-lime-100 text-lime-700";
        default:
            return "bg-slate-100 text-slate-700";
    }
}

function leftIcon(kind: ActivityItem["actionKind"]) {
    switch (kind) {
        case "bulk_activate":
        case "bulk_deactivate":
            return <Activity size={18} className="text-slate-500" />;
        case "bulk_delete":
        case "delete":
            return <Trash2 size={18} className="text-red-500" />;
        case "create":
            return <Plus size={18} className="text-green-600" />;
        case "update":
            return <Pencil size={18} className="text-sky-600" />;
        case "pause_subscription":
            return <Pause size={18} className="text-orange-500" />;
        case "resume_subscription":
            return <Play size={18} className="text-green-600" />;
        case "cancel_subscription":
            return <Ban size={18} className="text-red-500" />;
        default:
            return <Activity size={18} className="text-slate-500" />;
    }
}

export default function ActivityTable({ items }: { items: ActivityItem[] }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header bar like screenshot */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
                <Activity size={18} className="text-slate-600" />
                <div className="text-base font-semibold text-slate-900">
                    Recent Activity ({items.length})
                </div>
            </div>

            {/* Column headers band */}
            <div className="grid grid-cols-12 border-b border-slate-200 bg-[#f8fbff] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <div className="col-span-3">Action</div>
                <div className="col-span-3">Entity</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">User</div>
                <div className="col-span-2">Date &amp; Time</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
                {items.map((it) => (
                    <div
                        key={it.id}
                        className={cn(
                            "grid grid-cols-12 items-center px-6 py-4 transition",
                            "hover:bg-[#f6fbff]" // the light hover like screenshot
                        )}
                    >
                        {/* ACTION */}
                        <div className="col-span-3 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                                {leftIcon(it.actionKind)}
                            </div>

                            <span
                                className={cn(
                                    "rounded-full px-3 py-1 text-xs font-semibold",
                                    actionBadge(it.actionKind)
                                )}
                            >
                {it.actionLabel}
              </span>
                        </div>

                        {/* ENTITY */}
                        <div className="col-span-3 text-sm font-semibold text-slate-900">
                            {it.entity}
                        </div>

                        {/* TYPE */}
                        <div className="col-span-2">
              <span
                  className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      typeBadge(it.type)
                  )}
              >
                {it.type}
              </span>
                        </div>

                        {/* USER */}
                        <div className="col-span-2 text-sm text-slate-700">{it.user}</div>

                        {/* DATE */}
                        <div className="col-span-2 text-sm text-slate-500">{it.dateTime}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
