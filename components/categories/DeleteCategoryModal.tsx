"use client";

export default function DeleteCategoryModal({
                                                open,
                                                onClose,
                                                onConfirm,
                                            }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[120]">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            <div className="absolute left-1/2 top-1/2 w-[620px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-2xl">
                <div className="text-lg font-semibold text-slate-900">
                    Delete Category
                </div>
                <p className="mt-2 max-w-[520px] text-sm text-slate-500">
                    Are you sure you want to delete this category? This will also delete all
                    associated interests. This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            onConfirm();
                        }}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
