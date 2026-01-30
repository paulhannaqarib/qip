import Link from "next/link";
import { ACTIVITIES } from "@/lib/activity";
import { Activity } from "lucide-react";

export default function RecentActivity() {
    // Dashboard shows only the top 5 like the screenshot
    const items = ACTIVITIES.slice(0, 5);

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="text-base font-semibold text-slate-900">
                    Recent Activity
                </div>

                <Link
                    href="/activity-logs"
                    className="text-sm text-sky-600 hover:underline"
                >
                    View all ↗
                </Link>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100">
                {items.map((it) => (
                    <div key={it.id} className="flex items-center gap-4 px-6 py-4">
                        {/* Left icon circle */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <Activity size={18} />
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-slate-900">
                                {it.user} {it.actionLabel} {it.entity}
                            </div>
                            <div className="text-xs text-slate-400">{it.type}</div>
                        </div>

                        {/* Time ago */}
                        <div className="text-xs text-slate-400">{it.timeAgo}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
