"use client";

import { Reminder } from "@/types";
import { Flag } from "lucide-react";
import { useState } from "react";

interface ReminderItemProps {
  reminder: Reminder;
  isSelected: boolean;
  animatingOut?: boolean;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "!",
  MEDIUM: "!!",
  HIGH: "!!!",
};

export default function ReminderItem({
  reminder,
  isSelected,
  animatingOut,
  onToggle,
  onSelect,
}: ReminderItemProps) {
  const [justChecked, setJustChecked] = useState(false);
  const priorityLabel = PRIORITY_LABELS[reminder.priority];

  const subInfo: string[] = [];
  if (reminder.memo) {
    subInfo.push(reminder.memo.length > 40 ? reminder.memo.slice(0, 40) + "…" : reminder.memo);
  }
  if (reminder.dueDate) {
    let dateStr = reminder.dueDate;
    if (reminder.dueTime) {
      dateStr += " " + reminder.dueTime.slice(0, 5);
    }
    subInfo.push(dateStr);
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!reminder.completed) {
      setJustChecked(true);
    }
    onToggle(reminder.id);
  };

  return (
    <div
      className={`flex items-start min-h-[44px] px-4 py-2 cursor-pointer transition-colors duration-150 ${
        animatingOut ? "slide-out-collapse" : ""
      } ${
        isSelected ? "bg-[var(--color-bg-selected)]" : "hover:bg-[var(--color-bg-hover)]"
      }`}
      onClick={() => onSelect(reminder.id)}
    >
      {/* Check Circle */}
      <button
        onClick={handleToggle}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 mt-0.5 ${
          reminder.completed
            ? "border-[var(--color-system-blue)] bg-[var(--color-system-blue)]"
            : "border-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-hover)]"
        }`}
      >
        {reminder.completed && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={justChecked ? "check-animate" : ""}
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center gap-1">
          {priorityLabel && (
            <span className="text-[var(--color-system-blue)] font-bold text-sm">
              {priorityLabel}
            </span>
          )}
          <span
            className={`text-base leading-tight transition-all duration-300 ${
              reminder.completed
                ? "line-through text-[var(--color-text-secondary)]"
                : "text-[var(--color-text-primary)]"
            }`}
          >
            {reminder.title}
          </span>
        </div>
        {subInfo.length > 0 && (
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5 truncate">
            {subInfo.join(" · ")}
          </p>
        )}
      </div>

      {/* Flag */}
      {reminder.flagged && (
        <Flag
          size={14}
          className="text-[var(--color-system-orange)] flex-shrink-0 mt-1 ml-2"
          fill="currentColor"
        />
      )}
    </div>
  );
}
