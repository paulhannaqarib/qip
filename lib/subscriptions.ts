// lib/subscriptions.ts
import type { SubscriptionStatus, SubscriptionLabel } from "@/lib/municipalities";

export const SUBSCRIPTION_FILTERS: { value: SubscriptionStatus; label: SubscriptionLabel }[] = [
    { value: "all", label: "All Subscriptions" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "cancelled", label: "Cancelled" },
    { value: "no_subscription", label: "No Subscription" },
];
