export default function SubscriptionPlans() {
    const items = [
        { label: "Basic (0)", dot: "bg-slate-400" },
        { label: "Standard (0)", dot: "bg-sky-400" },
        { label: "Premium (0)", dot: "bg-indigo-900" },
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-base font-semibold text-slate-900">
                    Subscription Plans
                </div>
            </div>

            <div className="flex h-[320px] flex-col items-center justify-end px-6 pb-6">
                <div className="flex items-center gap-8">
                    {items.map((it) => (
                        <div
                            key={it.label}
                            className="flex items-center gap-2 text-sm text-slate-500"
                        >
                            <span className={`h-3 w-3 rounded-full ${it.dot}`} />
                            <span>{it.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
