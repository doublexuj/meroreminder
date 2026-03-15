"use client";

import { Plus } from "lucide-react";
import { useState, useRef, useEffect, memo } from "react";

interface AddReminderProps {
  onAdd: (title: string) => void;
}

export default memo(function AddReminder({ onAdd }: AddReminderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed) {
      onAdd(trimmed);
    }
    setTitle("");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setTitle("");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center min-h-[44px] px-4">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--color-text-tertiary)] flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmit}
          placeholder="New Reminder"
          className="ml-3 flex-1 text-base bg-transparent outline-none placeholder:text-[var(--color-text-tertiary)]"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-1 px-4 py-3 text-[var(--color-system-blue)] font-medium text-base hover:bg-[var(--color-bg-hover)] transition-colors duration-150"
    >
      <Plus size={18} />
      <span>Add Reminder</span>
    </button>
  );
})
