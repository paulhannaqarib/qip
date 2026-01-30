"use client";

import { X } from "lucide-react";

export default function DeleteMunicipalityModal({
                                                    open,
                                                    municipalityName,
                                                    onClose,
                                                    onConfirm,
                                                }: {
    open: boolean;
    municipalityName: string;
    onClose: () => void;
    onConfirm: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-[520px] max-w-[92vw] rounded-2xl bg-white p-8 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="text-xl font-bold text-slate-900">Delete Municipality</div>
                <div className="mt-2 text-sm text-slate-600">
                    Are you sure you want to delete <span className="font-semibold">{municipalityName}</span>? This action
                    cannot be undone.
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="h-11 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
