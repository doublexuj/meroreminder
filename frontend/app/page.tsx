"use client";

import { useEffect, useState, useCallback } from "react";
import { Reminder } from "@/types";
import { fetchReminders, createReminder, toggleReminder } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import ReminderList from "@/components/ReminderList";
import AddReminder from "@/components/AddReminder";

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const loadReminders = useCallback(async () => {
    try {
      const data = await fetchReminders();
      setReminders(data);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
    }
  }, []);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleAdd = async (title: string) => {
    try {
      await createReminder(title);
      await loadReminders();
    } catch (error) {
      console.error("Failed to create reminder:", error);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleReminder(id);
      await loadReminders();
    } catch (error) {
      console.error("Failed to toggle reminder:", error);
    }
  };

  const incompleteCount = reminders.filter((r) => !r.completed).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar allCount={incompleteCount} />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-2">
          <h1 className="text-[28px] font-bold text-[var(--color-text-primary)]">
            All
          </h1>
        </div>

        {/* Reminder List */}
        <div className="flex-1 flex flex-col">
          <ReminderList
            reminders={reminders}
            onToggle={handleToggle}
          />
        </div>

        {/* Add Reminder */}
        <div className="border-t border-[var(--color-border)]">
          <AddReminder onAdd={handleAdd} />
        </div>
      </main>
    </div>
  );
}
