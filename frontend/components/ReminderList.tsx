"use client";

import { Reminder, ReminderListItem } from "@/types";
import ReminderItem from "./ReminderItem";
import ReminderDetail from "./ReminderDetail";
import { CheckCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface ReminderListProps {
  reminders: Reminder[];
  selectedId: number | null;
  lists: ReminderListItem[];
  emptyMessage?: string;
  animatingOutId?: number | null;
  deletingId?: number | null;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
  onUpdate: (id: number, data: Partial<Reminder>) => void;
  onDelete: (id: number) => void;
}

export default function ReminderList({
  reminders,
  selectedId,
  lists,
  emptyMessage = "No Reminders",
  animatingOutId,
  deletingId,
  onToggle,
  onSelect,
  onUpdate,
  onDelete,
}: ReminderListProps) {
  const prevIdsRef = useRef<Set<number>>(new Set());
  const [newIds, setNewIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const currentIds = new Set(reminders.map((r) => r.id));
    const added = new Set<number>();
    currentIds.forEach((id) => {
      if (!prevIdsRef.current.has(id)) {
        added.add(id);
      }
    });
    prevIdsRef.current = currentIds;
    if (added.size > 0) {
      setNewIds(added);
      const timer = setTimeout(() => setNewIds(new Set()), 300);
      return () => clearTimeout(timer);
    }
  }, [reminders]);

  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 fade-slide-in">
        <CheckCircle size={48} className="text-[var(--color-text-tertiary)]" />
        <p className="text-[var(--color-text-secondary)] text-base">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {reminders.map((reminder, index) => (
        <div
          key={reminder.id}
          className={`${newIds.has(reminder.id) ? "slide-down-enter" : ""} ${
            deletingId === reminder.id ? "slide-out-delete" : ""
          }`}
        >
          <ReminderItem
            reminder={reminder}
            isSelected={selectedId === reminder.id}
            animatingOut={animatingOutId === reminder.id}
            onToggle={onToggle}
            onSelect={onSelect}
          />
          {/* Inline Detail */}
          {selectedId === reminder.id && (
            <div className="expand-detail">
              <ReminderDetail
                reminder={reminder}
                lists={lists}
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
