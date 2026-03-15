import { useState, useCallback } from "react";
import { ReminderListItem, Summary } from "@/types";
import {
  fetchLists,
  createList,
  updateList,
  deleteList,
  fetchSummary,
} from "@/lib/api";

export function useLists(onError: (msg: string) => void) {
  const [lists, setLists] = useState<ReminderListItem[]>([]);
  const [summary, setSummary] = useState<Summary>({
    today: 0,
    scheduled: 0,
    all: 0,
    flagged: 0,
    completed: 0,
  });
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState<ReminderListItem | null>(null);

  const loadLists = useCallback(async () => {
    try {
      const data = await fetchLists();
      setLists(data);
    } catch {
      onError("Failed to load lists");
    }
  }, [onError]);

  const loadSummary = useCallback(async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch {
      onError("Failed to load summary");
    }
  }, [onError]);

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
      onError("Failed to save list");
    }
  };

  const handleDeleteList = async (
    id: number,
    onListDeleted: (id: number) => void
  ) => {
    try {
      await deleteList(id);
      onListDeleted(id);
      await Promise.all([loadLists(), loadSummary()]);
    } catch {
      onError("Failed to delete list");
    }
  };

  const closeListModal = () => {
    setShowListModal(false);
    setEditingList(null);
  };

  return {
    lists,
    summary,
    showListModal,
    editingList,
    loadLists,
    loadSummary,
    handleAddList,
    handleEditList,
    handleSaveList,
    handleDeleteList,
    closeListModal,
  };
}
