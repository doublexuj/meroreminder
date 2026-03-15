"use client";

import { useEffect, useState, useCallback } from "react";
import { Reminder, ReminderListItem, Summary } from "@/types";
import {
  fetchReminders,
  createReminder,
  updateReminder,
  toggleReminder,
  deleteReminder,
  fetchLists,
  createList,
  updateList,
  deleteList,
  fetchSummary,
} from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ReminderList from "@/components/ReminderList";
import AddReminder from "@/components/AddReminder";
import ListModal from "@/components/ListModal";
import { COLORS } from "@/components/ListModal";

export type SmartListType = "all" | "today" | "scheduled" | "flagged" | "completed";

const SMART_LIST_CONFIG: Record<SmartListType, { label: string; color: string; emptyMessage: string }> = {
  today: { label: "Today", color: "#007AFF", emptyMessage: "All Clear for Today" },
  scheduled: { label: "Scheduled", color: "#FF3B30", emptyMessage: "No Scheduled Reminders" },
  all: { label: "All", color: "#8E8E93", emptyMessage: "No Reminders" },
  flagged: { label: "Flagged", color: "#FF9500", emptyMessage: "No Flagged Reminders" },
  completed: { label: "Completed", color: "#8E8E93", emptyMessage: "No Completed Reminders" },
};

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

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [lists, setLists] = useState<ReminderListItem[]>([]);
  const [summary, setSummary] = useState<Summary>({ today: 0, scheduled: 0, all: 0, flagged: 0, completed: 0 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [smartListType, setSmartListType] = useState<SmartListType>("all");
  const [isSmartListSelected, setIsSmartListSelected] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState<ReminderListItem | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  }, []);

  const loadLists = useCallback(async () => {
    try {
      const data = await fetchLists();
      setLists(data);
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    }
  }, []);

  const loadReminders = useCallback(async () => {
    try {
      let params: Record<string, string> = {};
      if (isSmartListSelected) {
        params = getSmartListParams(smartListType);
      } else if (selectedListId !== null) {
        params = { listId: String(selectedListId) };
      }
      const data = await fetchReminders(params);
      setReminders(data);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
    }
  }, [selectedListId, isSmartListSelected, smartListType]);

  useEffect(() => {
    loadLists();
    loadSummary();
  }, [loadLists, loadSummary]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const refreshAll = async () => {
    await Promise.all([loadReminders(), loadLists(), loadSummary()]);
  };

  const handleAdd = async (title: string) => {
    try {
      await createReminder(title, isSmartListSelected ? null : selectedListId);
      await refreshAll();
    } catch (error) {
      console.error("Failed to create reminder:", error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleReminder(id);
      await refreshAll();
    } catch (error) {
      console.error("Failed to toggle reminder:", error);
    }
  };

  const handleUpdate = async (id: number, data: Partial<Reminder>) => {
    try {
      await updateReminder(id, data);
      await refreshAll();
    } catch (error) {
      console.error("Failed to update reminder:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReminder(id);
      setSelectedId(null);
      await refreshAll();
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleSelectSmartList = (type: SmartListType) => {
    setSmartListType(type);
    setSelectedListId(null);
    setIsSmartListSelected(true);
    setSelectedId(null);
  };

  const handleSelectList = (id: number) => {
    setSelectedListId(id);
    setIsSmartListSelected(false);
    setSelectedId(null);
  };

  const handleAddList = () => {
    setEditingList(null);
    setShowListModal(true);
  };

  const handleEditList = (list: ReminderListItem) => {
    setEditingList(list);
    setShowListModal(true);
  };

  const handleSaveList = async (name: string, color: string) => {
    try {
      if (editingList) {
        await updateList(editingList.id, name, color);
      } else {
        await createList(name, color);
      }
      setShowListModal(false);
      setEditingList(null);
      await loadLists();
    } catch (error) {
      console.error("Failed to save list:", error);
    }
  };

  const handleDeleteList = async (id: number) => {
    try {
      await deleteList(id);
      if (selectedListId === id) {
        handleSelectSmartList("all");
      }
      await refreshAll();
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  // Header config
  const selectedList = lists.find((l) => l.id === selectedListId);
  let headerTitle: string;
  let headerColor: string;
  let emptyMessage: string;

  if (isSmartListSelected) {
    const config = SMART_LIST_CONFIG[smartListType];
    headerTitle = config.label;
    headerColor = config.color;
    emptyMessage = config.emptyMessage;
  } else {
    headerTitle = selectedList?.name ?? "All";
    headerColor = COLORS.find((c) => c.name === selectedList?.color)?.hex ?? "var(--color-text-primary)";
    emptyMessage = "No Reminders";
  }

  // Today date string for Today header
  const todayDate = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar
        summary={summary}
        lists={lists}
        selectedListId={selectedListId}
        selectedSmartList={isSmartListSelected ? smartListType : null}
        onSelectSmartList={handleSelectSmartList}
        onSelectList={handleSelectList}
        onAddList={handleAddList}
        onEditList={handleEditList}
        onDeleteList={handleDeleteList}
      />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-2 flex items-baseline justify-between">
          <h1
            className="text-[28px] font-bold"
            style={{ color: headerColor }}
          >
            {headerTitle}
          </h1>
          {isSmartListSelected && smartListType === "today" && (
            <span className="text-[15px] text-[var(--color-text-secondary)]">
              {todayDate}
            </span>
          )}
        </div>

        {/* Reminder List */}
        <div className="flex-1 flex flex-col">
          <ReminderList
            reminders={reminders}
            selectedId={selectedId}
            lists={lists}
            emptyMessage={emptyMessage}
            onToggle={handleToggle}
            onSelect={handleSelect}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/* Add Reminder — hide for Completed smart list */}
        {!(isSmartListSelected && smartListType === "completed") && (
          <div className="border-t border-[var(--color-border)]">
            <AddReminder onAdd={handleAdd} />
          </div>
        )}
      </main>

      {/* List Modal */}
      {showListModal && (
        <ListModal
          initialName={editingList?.name}
          initialColor={editingList?.color}
          onSave={handleSaveList}
          onCancel={() => {
            setShowListModal(false);
            setEditingList(null);
          }}
        />
      )}
    </div>
  );
}
