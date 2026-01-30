"use client";

import type { Interest } from "@/lib/interests";

export default function DeleteInterestModal({
                                                open,
                                                interestName,
                                                onClose,
                                                onConfirm,
                                            }: {
    open: boolean;
    interestName: string;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative w-[520px] max-w-[92vw] rounded-2xl bg-white p-8 shadow-2xl">
                <div className="text-xl font-semibold text-slate-900">Delete Interest</div>
                <div className="mt-2 text-sm text-slate-500">
                    Are you sure you want to delete <span className="font-semibold text-slate-700">{interestName}</span>?
                    This action cannot be undone.
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="h-11 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
