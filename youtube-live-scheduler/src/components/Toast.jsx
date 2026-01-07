import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/15 shadow-lg text-sm text-slate-100 animate-[fadeIn_0.25s_ease-out]">
      <span className="text-lg">📺</span>

      <span className="flex-1">{message}</span>
    </div>
  );
}
