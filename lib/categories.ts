export type CategoryStatus = "active" | "inactive";

export type Category = {
    id: string;
    nameEn: string;
    nameAr: string;
    description: string;
    icon: string; // lucide icon name as string (like: "newspaper")
    status: CategoryStatus;
};


export const INITIAL_CATEGORIES: Category[] = [
    {
        id: "1",
        nameEn: "News & Updates",
        nameAr: "الأخبار والتحديثات",
        description: "General news and updates",
        icon: "newspaper",
        status: "inactive",
    },
    {
        id: "2",
        nameEn: "Sports & Recreation",
        nameAr: "الرياضة والترفيه",
        description: "Sports events and activities",
        icon: "trophy",
        status: "inactive",
    },
    {
        id: "3",
        nameEn: "Culture & Arts",
        nameAr: "الثقافة والفنون",
        description: "Cultural events and arts",
        icon: "palette",
        status: "active",
    },
    {
        id: "4",
        nameEn: "Health & Safety",
        nameAr: "الصحة والسلامة",
        description: "Health advisories and safety info",
        icon: "heart",
        status: "active",
    },
    {
        id: "5",
        nameEn: "Environment",
        nameAr: "البيئة",
        description: "Environmental initiatives",
        icon: "leaf",
        status: "active",
    },
    {
        id: "6",
        nameEn: "Education",
        nameAr: "التعليم",
        description: "Educational programs",
        icon: "graduation-cap",
        status: "inactive",
    },
    {
        id: "7",
        nameEn: "Test Category UI",
        nameAr: "فئة اختبار واجهة",
        description: "Test category created via UI",
        icon: "layout-list",
        status: "active",
    },
];
