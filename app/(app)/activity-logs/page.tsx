import ActivityLogsClient from "@/components/activity/ActivityLogsClient";

export default function ActivityLogsPage() {
    return (
        <>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Activity Logs</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Track all administrative actions
                </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <ActivityLogsClient />
            </div>
        </>
    );
}
