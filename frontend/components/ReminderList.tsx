"use client";

import { Reminder } from "@/types";
import ReminderItem from "./ReminderItem";
import ReminderDetail from "./ReminderDetail";
import { CheckCircle } from "lucide-react";

interface ReminderListProps {
  reminders: Reminder[];
  selectedId: number | null;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
  onUpdate: (id: number, data: Partial<Reminder>) => void;
  onDelete: (id: number) => void;
}

export default function ReminderList({
  reminders,
  selectedId,
  onToggle,
  onSelect,
  onUpdate,
  onDelete,
}: ReminderListProps) {
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
          <ReminderItem
            reminder={reminder}
            isSelected={selectedId === reminder.id}
            onToggle={onToggle}
            onSelect={onSelect}
          />
          {/* Inline Detail */}
          {selectedId === reminder.id && (
            <div className="overflow-hidden transition-all duration-250 ease-in-out">
              <ReminderDetail
                reminder={reminder}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          )}
          {index < reminders.length - 1 && (
            <div className="ml-[52px] h-px bg-[var(--color-border)]" />
          )}
        </div>
      ))}
    </div>
  );
}
