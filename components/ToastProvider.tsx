"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

interface ToastContextValue {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.toast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: string) => {
    setMessage(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message && (
        <div
          className="toast-enter fixed bottom-[18px] left-1/2 z-[200] flex items-center gap-2 rounded-[9px] bg-primary px-5 py-[11px] text-[13px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          role="status"
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
