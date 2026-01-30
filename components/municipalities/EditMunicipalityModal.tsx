"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Municipality } from "@/lib/municipalities";

function Label({ children }: { children: React.ReactNode }) {
    return <div className="text-sm font-semibold text-slate-900">{children}</div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none focus:border-slate-300 ${
                props.className ?? ""
            }`}
        />
    );
}

export default function EditMunicipalityModal({
                                                  open,
                                                  municipality,
                                                  onClose,
                                                  onUpdate,
                                              }: {
    open: boolean;
    municipality: Municipality | null;
    onClose: () => void;
    onUpdate: (updated: Municipality) => void;
}) {
    const [nameEn, setNameEn] = useState("");
    const [nameAr, setNameAr] = useState("");
    const [region, setRegion] = useState("");
    const [country, setCountry] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [population, setPopulation] = useState("");

    useEffect(() => {
        if (!open || !municipality) return;

        setNameEn(municipality.nameEn || "");
        setNameAr(municipality.nameAr || "");
        setRegion(municipality.region || "");
        setCountry(municipality.country || "");
        setContactEmail(municipality.contactEmail || "");
        setContactPhone(municipality.contactPhone || "");
        setPopulation(
            typeof municipality.population === "number" ? String(municipality.population) : ""
        );
    }, [open, municipality]);

    function submit() {
        if (!municipality) return;
        const trimmedName = nameEn.trim();
        if (!trimmedName) return;

        const pop = Number(String(population).replace(/,/g, "").trim());

        onUpdate({
            ...municipality,
            nameEn: trimmedName,
            nameAr: nameAr.trim(),
            region: region.trim(),
            country: country.trim(),
            contactEmail: contactEmail.trim(),
            contactPhone: contactPhone.trim(),
            population: Number.isFinite(pop) ? pop : 0,
        });
    }

    if (!open || !municipality) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-[980px] max-w-[92vw] rounded-2xl bg-white p-10 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="text-2xl font-bold text-slate-900">Edit Municipality</div>
                <div className="mt-1 text-sm text-slate-500">Update the municipality details below.</div>

                <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
                    <div>
                        <Label>
                            Name (English) <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-2">
                            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label>Name (Arabic)</Label>
                        <div className="mt-2">
                            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label>Region</Label>
                        <div className="mt-2">
                            <Input value={region} onChange={(e) => setRegion(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label>Country</Label>
                        <div className="mt-2">
                            <Input value={country} onChange={(e) => setCountry(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label>Contact Email</Label>
                        <div className="mt-2">
                            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <Label>Contact Phone</Label>
                        <div className="mt-2">
                            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <Label>Population</Label>
                        <div className="mt-2">
                            <Input value={population} onChange={(e) => setPopulation(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={submit}
                        disabled={!nameEn.trim()}
                        className="h-11 rounded-xl bg-indigo-900 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 disabled:opacity-50"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}
