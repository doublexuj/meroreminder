"use client";

import { Reminder } from "@/types";

interface ReminderItemProps {
  reminder: Reminder;
  onToggle: (id: number) => void;
}

export default function ReminderItem({ reminder, onToggle }: ReminderItemProps) {
  return (
    <div className="flex items-center min-h-[44px] px-4 group">
      {/* Check Circle */}
      <button
        onClick={() => onToggle(reminder.id)}
        className="w-6 h-6 rounded-full border-2 border-[var(--color-text-tertiary)] flex-shrink-0 flex items-center justify-center hover:bg-[var(--color-bg-hover)] transition-colors duration-150"
      >
        {reminder.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="var(--color-text-secondary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={`ml-3 text-base leading-tight ${
          reminder.completed
            ? "line-through text-[var(--color-text-secondary)]"
            : "text-[var(--color-text-primary)]"
        }`}
      >
        {reminder.title}
      </span>
    </div>
  );
}
