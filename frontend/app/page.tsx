"use client";

import { useEffect, useState, useCallback } from "react";
import { Reminder, ReminderListItem } from "@/types";
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
} from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ReminderList from "@/components/ReminderList";
import AddReminder from "@/components/AddReminder";
import ListModal from "@/components/ListModal";
import { COLORS } from "@/components/ListModal";

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [lists, setLists] = useState<ReminderListItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isSmartListSelected, setIsSmartListSelected] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState<ReminderListItem | null>(null);

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
      const params: Record<string, string> = {};
      if (selectedListId !== null) {
        params.listId = String(selectedListId);
      }
      const data = await fetchReminders(params);
      setReminders(data);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
    }
  }, [selectedListId]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleAdd = async (title: string) => {
    try {
      await createReminder(title, isSmartListSelected ? null : selectedListId);
      await loadReminders();
      await loadLists();
    } catch (error) {
      console.error("Failed to create reminder:", error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleReminder(id);
      await loadReminders();
      await loadLists();
    } catch (error) {
      console.error("Failed to toggle reminder:", error);
    }
  };

  const handleUpdate = async (id: number, data: Partial<Reminder>) => {
    try {
      await updateReminder(id, data);
      await loadReminders();
      await loadLists();
    } catch (error) {
      console.error("Failed to update reminder:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteReminder(id);
      setSelectedId(null);
      await loadReminders();
      await loadLists();
    } catch (error) {
      console.error("Failed to delete reminder:", error);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handleSelectAll = () => {
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
        handleSelectAll();
      }
      await loadLists();
      await loadReminders();
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  const incompleteCount = reminders.filter((r) => !r.completed).length;

  const selectedList = lists.find((l) => l.id === selectedListId);
  const headerTitle = isSmartListSelected ? "All" : selectedList?.name ?? "All";
  const headerColor = isSmartListSelected
    ? "var(--color-text-primary)"
    : COLORS.find((c) => c.name === selectedList?.color)?.hex ?? "var(--color-text-primary)";

  return (
    <div className="flex min-h-screen">
      <Sidebar
        allCount={incompleteCount}
        lists={lists}
        selectedListId={selectedListId}
        isSmartListSelected={isSmartListSelected}
        onSelectAll={handleSelectAll}
        onSelectList={handleSelectList}
        onAddList={handleAddList}
        onEditList={handleEditList}
        onDeleteList={handleDeleteList}
      />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-2">
          <h1
            className="text-[28px] font-bold"
            style={{ color: headerColor }}
          >
            {headerTitle}
          </h1>
        </div>

        {/* Reminder List */}
        <div className="flex-1 flex flex-col">
          <ReminderList
            reminders={reminders}
            selectedId={selectedId}
            lists={lists}
            onToggle={handleToggle}
            onSelect={handleSelect}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>

        {/* Add Reminder */}
        <div className="border-t border-[var(--color-border)]">
          <AddReminder onAdd={handleAdd} />
        </div>
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
