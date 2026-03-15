"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Reminder, ReminderListItem, ListSelection, SmartListType } from "@/types";
import Sidebar from "@/components/Sidebar";
import ReminderList from "@/components/ReminderList";
import AddReminder from "@/components/AddReminder";
import ListModal from "@/components/ListModal";
import Toast from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getColorHex } from "@/lib/colors";
import { useReminders } from "@/hooks/useReminders";
import { useLists } from "@/hooks/useLists";
import { Menu } from "lucide-react";

export type { SmartListType } from "@/types";

const SMART_LIST_CONFIG: Record<SmartListType, { label: string; color: string; emptyMessage: string }> = {
  today: { label: "Today", color: "#007AFF", emptyMessage: "All Clear for Today" },
  scheduled: { label: "Scheduled", color: "#FF3B30", emptyMessage: "No Scheduled Reminders" },
  all: { label: "All", color: "#8E8E93", emptyMessage: "No Reminders" },
  flagged: { label: "Flagged", color: "#FF9500", emptyMessage: "No Flagged Reminders" },
  completed: { label: "Completed", color: "#8E8E93", emptyMessage: "No Completed Reminders" },
};

export default function Home() {
  const [selection, setSelection] = useState<ListSelection>({ kind: "smart", smartListType: "all" });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const initialLoadRef = useRef(true);

  const showError = useCallback((msg: string) => setToastMessage(msg), []);

  const {
    lists, summary, showListModal, editingList,
    loadLists, loadSummary,
    handleAddList, handleEditList, handleSaveList, handleDeleteList, closeListModal,
  } = useLists(showError);

  const {
    reminders, selectedId, animatingOutId, deletingId,
    setSelectedId, loadReminders,
    handleAdd, handleToggle, handleUpdate, handleDelete, handleSelect,
  } = useReminders(selection, showError);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadReminders(), loadLists(), loadSummary()]);
  }, [loadReminders, loadLists, loadSummary]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadLists(), loadSummary(), loadReminders()]);
      setLoading(false);
      initialLoadRef.current = false;
    };
    init();
  }, [loadLists, loadSummary, loadReminders]);

  const handleSelectSmartList = (type: SmartListType) => {
    setSelection({ kind: "smart", smartListType: type });
    setSelectedId(null);
    setContentKey((k) => k + 1);
    setSidebarOpen(false);
  };

  const handleSelectList = (id: number) => {
    setSelection({ kind: "custom", listId: id });
    setSelectedId(null);
    setContentKey((k) => k + 1);
    setSidebarOpen(false);
  };

  const onDeleteList = async (id: number) => {
    await handleDeleteList(id, (deletedId) => {
      if (selection.kind === "custom" && selection.listId === deletedId) {
        handleSelectSmartList("all");
      }
    });
    await loadReminders();
  };

  // Header config
  const selectedListId = selection.kind === "custom" ? selection.listId : null;
  const selectedSmartList = selection.kind === "smart" ? selection.smartListType : null;
  const selectedList = lists.find((l) => l.id === selectedListId);

  let headerTitle: string;
  let headerColor: string;
  let emptyMessage: string;

  if (selection.kind === "smart") {
    const config = SMART_LIST_CONFIG[selection.smartListType];
    headerTitle = config.label;
    headerColor = config.color;
    emptyMessage = config.emptyMessage;
  } else {
    headerTitle = selectedList?.name ?? "All";
    headerColor = getColorHex(selectedList?.color ?? "");
    emptyMessage = "No Reminders";
  }

  const isCompletedView = selection.kind === "smart" && selection.smartListType === "completed";

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const todayDate = useMemo(
    () =>
      new Date().toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }),
    []
  );

  return (
    <ErrorBoundary>
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
            selectedSmartList={selectedSmartList}
            onSelectSmartList={handleSelectSmartList}
            onSelectList={handleSelectList}
            onAddList={handleAddList}
            onEditList={handleEditList}
            onDeleteList={onDeleteList}
          />
        </div>

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="메뉴 열기"
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
            {selection.kind === "smart" && selection.smartListType === "today" && (
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
                  onToggle={(id) => handleToggle(id, refreshAll)}
                  onSelect={handleSelect}
                  onUpdate={(id, data) => handleUpdate(id, data, refreshAll)}
                  onDelete={(id) => handleDelete(id, refreshAll)}
                />
              </div>
            )}
          </div>

          {/* Add Reminder — hide for Completed smart list */}
          {!isCompletedView && (
            <div className="border-t border-[var(--color-border)]">
              <AddReminder onAdd={(title) => handleAdd(title, refreshAll)} />
            </div>
          )}
        </main>

        {/* List Modal */}
        {showListModal && (
          <ListModal
            initialName={editingList?.name}
            initialColor={editingList?.color}
            onSave={handleSaveList}
            onCancel={closeListModal}
          />
        )}

        {/* Toast */}
        {toastMessage && (
          <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        )}
      </div>
    </ErrorBoundary>
  );
}
