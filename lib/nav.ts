import {
    LayoutGrid,
    List,
    Tags,
    Building2,
    CreditCard,
    Activity,
} from "lucide-react";

export const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutGrid },
    { label: "Categories", href: "/categories", icon: List },
    { label: "Interests", href: "/interests", icon: Tags },
    { label: "Municipalities", href: "/municipalities", icon: Building2 },
    { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { label: "Activity Logs", href: "/activity-logs", icon: Activity },
];
