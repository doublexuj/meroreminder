"use client";

import { Reminder, Priority } from "@/types";
import { Flag } from "lucide-react";
import { useState } from "react";

interface ReminderDetailProps {
  reminder: Reminder;
  onUpdate: (id: number, data: Partial<Reminder>) => void;
  onDelete: (id: number) => void;
}

const PRIORITIES: { label: string; value: Priority }[] = [
  { label: "—", value: "NONE" },
  { label: "!", value: "LOW" },
  { label: "!!", value: "MEDIUM" },
  { label: "!!!", value: "HIGH" },
];

export default function ReminderDetail({
  reminder,
  onUpdate,
  onDelete,
}: ReminderDetailProps) {
  const [title, setTitle] = useState(reminder.title);
  const [memo, setMemo] = useState(reminder.memo ?? "");
  const [dueDate, setDueDate] = useState(reminder.dueDate ?? "");
  const [dueTime, setDueTime] = useState(reminder.dueTime?.slice(0, 5) ?? "");
  const [priority, setPriority] = useState<Priority>(reminder.priority);
  const [flagged, setFlagged] = useState(reminder.flagged);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const save = (fields: Partial<Reminder>) => {
    onUpdate(reminder.id, fields);
  };

  return (
    <div className="px-4 pl-[52px] pb-4 flex flex-col gap-3">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
          if (title.trim() && title !== reminder.title) {
            save({ title: title.trim() });
          }
        }}
        className="text-base bg-transparent outline-none text-[var(--color-text-primary)] font-medium"
      />

      {/* Memo */}
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        onBlur={() => {
          if (memo !== (reminder.memo ?? "")) {
            save({ memo: memo || null });
          }
        }}
        placeholder="Add Note"
        rows={2}
        className="text-[13px] bg-[var(--color-bg-input)] rounded-lg px-3 py-2 outline-none resize-none placeholder:text-[var(--color-text-tertiary)]"
      />

      {/* Date & Time */}
      <div className="flex gap-2">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            save({ dueDate: e.target.value || null });
          }}
          className="text-[13px] bg-[var(--color-bg-input)] rounded-lg px-3 py-1.5 outline-none"
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => {
            setDueTime(e.target.value);
            save({ dueTime: e.target.value || null });
          }}
          className="text-[13px] bg-[var(--color-bg-input)] rounded-lg px-3 py-1.5 outline-none"
        />
      </div>

      {/* Priority */}
      <div className="flex gap-1">
        {PRIORITIES.map((p) => (
          <button
            key={p.value}
            onClick={() => {
              setPriority(p.value);
              save({ priority: p.value });
            }}
            className={`px-3 py-1 rounded-md text-[13px] font-medium transition-colors ${
              priority === p.value
                ? "bg-[var(--color-system-blue)] text-white"
                : "bg-[var(--color-bg-input)] text-[var(--color-text-secondary)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Flag & Delete */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            const newFlagged = !flagged;
            setFlagged(newFlagged);
            save({ flagged: newFlagged });
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-[13px] transition-colors ${
            flagged
              ? "text-[var(--color-system-orange)]"
              : "text-[var(--color-text-secondary)]"
          }`}
        >
          <Flag size={14} fill={flagged ? "currentColor" : "none"} />
          <span>Flag</span>
        </button>

        {showDeleteConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(reminder.id)}
              className="text-[13px] text-white bg-[var(--color-system-red)] px-3 py-1 rounded-md"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-[13px] text-[var(--color-text-secondary)] px-3 py-1"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-[13px] text-[var(--color-system-red)]"
          >
            Delete Reminder
          </button>
        )}
      </div>
    </div>
  );
}
