"use client";

import { useState, useEffect, useRef } from "react";
import { List, Check } from "lucide-react";
import { COLORS } from "@/lib/colors";

interface ListModalProps {
  initialName?: string;
  initialColor?: string;
  onSave: (name: string, color: string) => void;
  onCancel: () => void;
}

export default function ListModal({
  initialName = "",
  initialColor = "BLUE",
  onSave,
  onCancel,
}: ListModalProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const selectedHex =
    COLORS.find((c) => c.name === color)?.hex ?? "#007AFF";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" ref={dialogRef}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[14px] shadow-xl w-[360px] p-6 flex flex-col items-center gap-5">
        {/* Icon Preview */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: selectedHex }}
        >
          <List size={28} className="text-white" />
        </div>

        {/* Name Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="List Name"
          className="w-full text-center text-lg bg-[var(--color-bg-input)] rounded-lg px-4 py-2 outline-none"
          autoFocus
        />

        {/* Color Palette */}
        <div className="grid grid-cols-4 gap-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setColor(c.name)}
              aria-label={c.name}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ backgroundColor: c.hex }}
            >
              {color === c.name && (
                <Check size={16} className="text-white" />
              )}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between w-full pt-2">
          <button
            onClick={onCancel}
            className="text-[var(--color-system-blue)] font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave(name.trim(), color);
              }
            }}
            className="text-[var(--color-system-blue)] font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
