export type InterestStatus = "active" | "inactive";

export type Interest = {
    id: string;
    nameEn: string;
    nameAr: string;
    description: string;
    categoryId: string;
    status: InterestStatus;
    createdAt: string; // ISO
    updatedAt: string; // ISO
};



export type CreateInterestInput = {
    nameEn: string;
    nameAr: string;
    description: string;
    categoryId: string;
};

export type UpdateInterestInput = {
    nameEn: string;
    nameAr: string;
    description: string;
    categoryId: string;
};

export function makeId(prefix = "int") {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function nowIso() {
    return new Date().toISOString();
}
