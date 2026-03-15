"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import Toast from "@/components/Toast";
import { COLORS } from "@/components/ListModal";
import { Menu } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [animatingOutId, setAnimatingOutId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const initialLoadRef = useRef(true);

  const showError = (msg: string) => setToastMessage(msg);

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch {
      showError("Failed to load summary");
    }
  }, []);

  const loadLists = useCallback(async () => {
    try {
      const data = await fetchLists();
      setLists(data);
    } catch {
      showError("Failed to load lists");
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
    } catch {
      showError("Failed to load reminders");
    }
  }, [selectedListId, isSmartListSelected, smartListType]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadLists(), loadSummary(), loadReminders()]);
      setLoading(false);
      initialLoadRef.current = false;
    };
    init();
  }, [loadLists, loadSummary, loadReminders]);

  const refreshAll = async () => {
    await Promise.all([loadReminders(), loadLists(), loadSummary()]);
  };

  const handleAdd = async (title: string) => {
    try {
      await createReminder(title, isSmartListSelected ? null : selectedListId);
      await refreshAll();
    } catch {
      showError("Failed to create reminder");
    }
  };

  const handleToggle = async (id: number) => {
    const original = reminders;
    const target = reminders.find((r) => r.id === id);
    if (!target) return;

    const wasCompleted = target.completed;
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );

    if (!wasCompleted && smartListType !== "completed") {
      setAnimatingOutId(id);
    }

    try {
      await toggleReminder(id);
      if (!wasCompleted && smartListType !== "completed") {
        await new Promise((r) => setTimeout(r, 500));
      }
      setAnimatingOutId(null);
      await refreshAll();
    } catch {
      setReminders(original);
      setAnimatingOutId(null);
      showError("Failed to toggle reminder");
    }
  };

  const handleUpdate = async (id: number, data: Partial<Reminder>) => {
    try {
      await updateReminder(id, data);
      await refreshAll();
    } catch {
      showError("Failed to update reminder");
    }
  };

  const handleDelete = async (id: number) => {
    const original = reminders;
    setDeletingId(id);

    try {
      await deleteReminder(id);
      await new Promise((r) => setTimeout(r, 300));
      setDeletingId(null);
      setSelectedId(null);
      await refreshAll();
    } catch {
      setDeletingId(null);
      setReminders(original);
      showError("Failed to delete reminder");
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
    setContentKey((k) => k + 1);
    setSidebarOpen(false);
  };

  const handleSelectList = (id: number) => {
    setSelectedListId(id);
    setIsSmartListSelected(false);
    setSelectedId(null);
    setContentKey((k) => k + 1);
    setSidebarOpen(false);
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
    } catch {
      showError("Failed to save list");
    }
  };

  const handleDeleteList = async (id: number) => {
    try {
      await deleteList(id);
      if (selectedListId === id) {
        handleSelectSmartList("all");
      }
      await refreshAll();
    } catch {
      showError("Failed to delete list");
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

  const todayDate = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static z-50 lg:z-auto transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1 -ml-1 text-[var(--color-system-blue)]"
            >
              <Menu size={24} />
            </button>
            <h1
              className="text-[24px] sm:text-[28px] font-bold"
              style={{ color: headerColor }}
            >
              {headerTitle}
            </h1>
          </div>
          {isSmartListSelected && smartListType === "today" && (
            <span className="text-[13px] sm:text-[15px] text-[var(--color-text-secondary)]">
              {todayDate}
            </span>
          )}
        </div>

        {/* Content area with transition */}
        <div className="flex-1 flex flex-col" key={contentKey}>
          {loading && initialLoadRef.current ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="spinner" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col fade-slide-in">
              <ReminderList
                reminders={reminders}
                selectedId={selectedId}
                lists={lists}
                emptyMessage={emptyMessage}
                animatingOutId={animatingOutId}
                deletingId={deletingId}
                onToggle={handleToggle}
                onSelect={handleSelect}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
          )}
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

      {/* Toast */}
      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}
