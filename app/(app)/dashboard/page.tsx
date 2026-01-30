import StatCard from "@/components/dashboard/StatCard";
import EntityOverview from "@/components/dashboard/EntityOverview";
import SubscriptionPlans from "@/components/dashboard/SubscriptionPlans";
import { List, Tags, Building2, CreditCard } from "lucide-react";
import RecentActivity from "@/components/activity/RecentActivity";


export default function DashboardPage() {
    return (
        <>
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Overview of your Qarib.ai platform
                </p>
            </div>

            {/* Top 4 cards */}
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Categories"
                    value={7}
                    metaText="↗ 4 active"
                    metaTone="success"
                    icon={<List size={20} />}
                />
                <StatCard
                    title="Interests"
                    value={10}
                    metaText="↗ 10 active"
                    metaTone="success"
                    icon={<Tags size={20} />}
                />
                <StatCard
                    title="Municipalities"
                    value={0}
                    metaText="↗ 0 active"
                    metaTone="success"
                    icon={<Building2 size={20} />}
                />
                <StatCard
                    title="Subscriptions"
                    value={0}
                    metaText="⏸ 0 paused"
                    metaTone="warning"
                    icon={<CreditCard size={20} />}
                />
            </div>

            {/* Charts row */}
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <EntityOverview />
                </div>
                <div className="xl:col-span-1">
                    <SubscriptionPlans />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
                <RecentActivity />
            </div>

        </>
    );
}
