"use client";

import { useMemo, useState } from "react";
import {
    ACTIVITIES,
    type EntityType,
    type ActivityItem,
} from "@/lib/activity";
import EntityTypeFilter from "@/components/activity/EntityTypeFilter";
import ActivityTable from "@/components/activity/ActivityTable";

export default function ActivityLogsClient() {
    const [filter, setFilter] = useState<EntityType>("all");

    const filtered: ActivityItem[] = useMemo(() => {
        if (filter === "all") return ACTIVITIES;
        return ACTIVITIES.filter((a) => a.type === filter);
    }, [filter]);

    return (
        <>
            {/* Filter row */}
            <div className="pb-4">
                <EntityTypeFilter value={filter} onChange={setFilter} />
            </div>

            {/* Table */}
            <ActivityTable items={filtered} />
        </>
    );
}
