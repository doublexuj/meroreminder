import { useState, useCallback } from "react";
import { Reminder, ListSelection, SmartListType } from "@/types";
import {
  fetchReminders,
  createReminder,
  updateReminder,
  toggleReminder,
  deleteReminder,
} from "@/lib/api";

function getSmartListParams(type: SmartListType): Record<string, string> {
  switch (type) {
    case "today":
      return { dueToday: "true", completed: "false" };
    case "scheduled":
      return { scheduled: "true", completed: "false" };
    case "all":
      return { completed: "false" };
    case "flagged":
      return { flagged: "true", completed: "false" };
    case "completed":
      return { completed: "true" };
  }
}

export function useReminders(
  selection: ListSelection,
  onError: (msg: string) => void
) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [animatingOutId, setAnimatingOutId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadReminders = useCallback(async () => {
    try {
      let params: Record<string, string>;
      if (selection.kind === "smart") {
        params = getSmartListParams(selection.smartListType);
      } else {
        params = { listId: String(selection.listId) };
      }
      const data = await fetchReminders(params);
      setReminders(data);
    } catch {
      onError("Failed to load reminders");
    }
  }, [selection, onError]);

  const handleAdd = async (title: string, onRefresh: () => Promise<void>) => {
    try {
      const listId = selection.kind === "custom" ? selection.listId : null;
      await createReminder(title, listId);
      await onRefresh();
    } catch {
      onError("Failed to create reminder");
    }
  };

  const handleToggle = async (id: number, onRefresh: () => Promise<void>) => {
    const original = reminders;
    const target = reminders.find((r) => r.id === id);
    if (!target) return;

    const wasCompleted = target.completed;
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );

    const smartListType = selection.kind === "smart" ? selection.smartListType : null;
    if (!wasCompleted && smartListType !== "completed") {
      setAnimatingOutId(id);
    }

    try {
      await toggleReminder(id);
      if (!wasCompleted && smartListType !== "completed") {
        await new Promise((r) => setTimeout(r, 500));
      }
      setAnimatingOutId(null);
      await onRefresh();
    } catch {
      setReminders(original);
      setAnimatingOutId(null);
      onError("Failed to toggle reminder");
    }
  };

  const handleUpdate = async (
    id: number,
    data: Partial<Reminder>,
    onRefresh: () => Promise<void>
  ) => {
    try {
      await updateReminder(id, data);
      await onRefresh();
    } catch {
      onError("Failed to update reminder");
    }
  };

  const handleDelete = async (id: number, onRefresh: () => Promise<void>) => {
    const original = reminders;
    setDeletingId(id);

    try {
      await deleteReminder(id);
      await new Promise((r) => setTimeout(r, 300));
      setDeletingId(null);
      setSelectedId(null);
      await onRefresh();
    } catch {
      setDeletingId(null);
      setReminders(original);
      onError("Failed to delete reminder");
    }
  };

  const handleSelect = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return {
    reminders,
    selectedId,
    animatingOutId,
    deletingId,
    setSelectedId,
    loadReminders,
    handleAdd,
    handleToggle,
    handleUpdate,
    handleDelete,
    handleSelect,
  };
}
