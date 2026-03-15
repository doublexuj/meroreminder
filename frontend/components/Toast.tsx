"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]" role="alert" aria-live="polite">
      <div
        className={`px-4 py-2.5 rounded-xl shadow-lg bg-[var(--color-text-primary)] text-white text-[14px] font-medium ${
          exiting ? "toast-exit" : "toast-enter"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
