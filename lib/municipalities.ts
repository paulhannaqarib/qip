export type MunicipalityStatus = "active" | "inactive";
export type SubscriptionStatus = "active" | "paused" | "cancelled" | "none";

export type Municipality = {
    id: string;

    nameEn: string;
    nameAr: string;

    region: string;
    country: string;

    contactEmail: string;
    contactPhone: string;

    population: number;

    // Content configuration
    categoryIds: string[];
    interestIds: string[];

    status: MunicipalityStatus;
    subscriptionStatus: SubscriptionStatus;

    createdAt: string; // ISO
    updatedAt: string; // ISO
};

export type CreateMunicipalityInput = {
    nameEn: string;
    nameAr: string;
    region: string;
    country: string;
    contactEmail: string;
    contactPhone: string;
    population: number;
};

export function makeId(prefix = "mun") {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function nowIso() {
    return new Date().toISOString();
}
