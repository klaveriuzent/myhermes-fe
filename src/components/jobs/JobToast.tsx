import { useEffect, useState } from "react";
import type { ToastState } from "../../hooks/useJobsData";

export default function JobToast({
  toast,
  onClear,
}: {
  toast: ToastState;
  onClear: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const id = setTimeout(() => {
      setVisible(false);
      setTimeout(onClear, 300);
    }, 3000);
    return () => clearTimeout(id);
  }, [toast, onClear]);

  const bg =
    toast.type === "success"
      ? "bg-success-500"
      : "bg-error-500";

  return (
    <div
      className={`pointer-events-none fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto rounded-xl ${bg} px-5 py-3 text-theme-sm font-medium text-white shadow-theme-lg`}
      >
        {toast.message}
      </div>
    </div>
  );
}
