"use client";

import { Reminder } from "@/types";
import ReminderItem from "./ReminderItem";
import { CheckCircle } from "lucide-react";

interface ReminderListProps {
  reminders: Reminder[];
  onToggle: (id: number) => void;
}

export default function ReminderList({ reminders, onToggle }: ReminderListProps) {
  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <CheckCircle size={48} className="text-[var(--color-text-tertiary)]" />
        <p className="text-[var(--color-text-secondary)] text-base">
          No Reminders
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {reminders.map((reminder, index) => (
        <div key={reminder.id}>
          <ReminderItem reminder={reminder} onToggle={onToggle} />
          {index < reminders.length - 1 && (
            <div className="ml-[52px] h-px bg-[var(--color-border)]" />
          )}
        </div>
      ))}
    </div>
  );
}
