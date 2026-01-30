export type EntityType =
    | "all"
    | "category"
    | "interest"
    | "municipality"
    | "subscription";

export type ActionKind =
    | "bulk_activate"
    | "bulk_deactivate"
    | "bulk_delete"
    | "delete"
    | "create"
    | "update"
    | "cancel_subscription"
    | "resume_subscription"
    | "pause_subscription";

export type ActivityItem = {
    id: string;
    actionKind: ActionKind;
    actionLabel: string; // text displayed in badge
    entity: string; // e.g. "10 interests" / "Riyadh Municipality"
    type: Exclude<EntityType, "all">; // no "all" for actual items
    user: string; // "Admin User"
    dateTime: string; // "Jan 27, 2026 15:37"
    timeAgo: string; // "1d ago"
};

export const ENTITY_TYPE_OPTIONS: { value: EntityType; label: string }[] = [
    { value: "all", label: "All Entity Types" },
    { value: "category", label: "Categories" },
    { value: "interest", label: "Interests" },
    { value: "municipality", label: "Municipalities" },
    { value: "subscription", label: "Subscriptions" },
];

// Demo data like your screenshots
export const ACTIVITIES: ActivityItem[] = [
    {
        id: "a1",
        actionKind: "bulk_activate",
        actionLabel: "Bulk Activate",
        entity: "10 interests",
        type: "interest",
        user: "Admin User",
        dateTime: "Jan 27, 2026 15:37",
        timeAgo: "1d ago",
    },
    {
        id: "a2",
        actionKind: "bulk_deactivate",
        actionLabel: "Bulk Deactivate",
        entity: "10 interests",
        type: "interest",
        user: "Admin User",
        dateTime: "Jan 27, 2026 15:37",
        timeAgo: "1d ago",
    },
    {
        id: "a3",
        actionKind: "bulk_delete",
        actionLabel: "Bulk Delete",
        entity: "5 municipalities",
        type: "municipality",
        user: "Admin User",
        dateTime: "Jan 27, 2026 15:37",
        timeAgo: "1d ago",
    },
    {
        id: "a4",
        actionKind: "delete",
        actionLabel: "Delete",
        entity: "test",
        type: "category",
        user: "Admin User",
        dateTime: "Jan 26, 2026 17:48",
        timeAgo: "2d ago",
    },
    {
        id: "a5",
        actionKind: "create",
        actionLabel: "Create",
        entity: "test",
        type: "category",
        user: "Admin User",
        dateTime: "Jan 26, 2026 17:48",
        timeAgo: "2d ago",
    },
    {
        id: "a6",
        actionKind: "create",
        actionLabel: "Create",
        entity: "Test Interest UI",
        type: "interest",
        user: "Admin User",
        dateTime: "Jan 26, 2026 17:18",
        timeAgo: "2d ago",
    },
    {
        id: "a7",
        actionKind: "update",
        actionLabel: "Update",
        entity: "Test Municipality",
        type: "municipality",
        user: "Admin User",
        dateTime: "Jan 26, 2026 17:17",
        timeAgo: "2d ago",
    },
    {
        id: "a8",
        actionKind: "cancel_subscription",
        actionLabel: "Cancel Subscription",
        entity: "Riyadh Municipality",
        type: "subscription",
        user: "Admin User",
        dateTime: "Jan 26, 2026 17:17",
        timeAgo: "2d ago",
    },
    {
        id: "a9",
        actionKind: "resume_subscription",
        actionLabel: "Resume Subscription",
        entity: "Riyadh Municipality",
        type: "subscription",
        user: "Admin User",
        dateTime: "Jan 26, 2026 17:17",
        timeAgo: "2d ago",
    },
    {
        id: "a10",
        actionKind: "pause_subscription",
        actionLabel: "Pause Subscription",
        entity: "Riyadh Municipality - Basic",
        type: "subscription",
        user: "Admin User",
        dateTime: "Jan 26, 2026 17:17",
        timeAgo: "2d ago",
    },
];
