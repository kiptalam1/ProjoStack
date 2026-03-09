import { X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm space-y-4">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {description && (
          <p className="text-sm text-muted">
            {description}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-sm border border-border rounded-lg"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="px-3 py-1 text-sm bg-danger text-white rounded-lg disabled:opacity-60"
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
