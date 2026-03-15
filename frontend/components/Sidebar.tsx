"use client";

import { Inbox, CalendarDays, Calendar, Flag, CheckCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { ReminderListItem, Summary } from "@/types";
import { getColorHex } from "@/lib/colors";
import { useState } from "react";
import type { SmartListType } from "@/types";

interface SmartListCard {
  type: SmartListType;
  label: string;
  icon: React.ReactNode;
  color: string;
  countKey: keyof Summary;
}

const SMART_LISTS: SmartListCard[] = [
  {
    type: "today",
    label: "Today",
    icon: <CalendarDays size={16} className="text-white" />,
    color: "#007AFF",
    countKey: "today",
  },
  {
    type: "scheduled",
    label: "Scheduled",
    icon: <Calendar size={16} className="text-white" />,
    color: "#FF3B30",
    countKey: "scheduled",
  },
  {
    type: "all",
    label: "All",
    icon: <Inbox size={16} className="text-white" />,
    color: "#8E8E93",
    countKey: "all",
  },
  {
    type: "flagged",
    label: "Flagged",
    icon: <Flag size={16} className="text-white" />,
    color: "#FF9500",
    countKey: "flagged",
  },
  {
    type: "completed",
    label: "Completed",
    icon: <CheckCircle size={16} className="text-white" />,
    color: "#8E8E93",
    countKey: "completed",
  },
];

interface SidebarProps {
  summary: Summary;
  lists: ReminderListItem[];
  selectedListId: number | null;
  selectedSmartList: SmartListType | null;
  onSelectSmartList: (type: SmartListType) => void;
  onSelectList: (id: number) => void;
  onAddList: () => void;
  onEditList: (list: ReminderListItem) => void;
  onDeleteList: (id: number) => void;
}

export default function Sidebar({
  summary,
  lists,
  selectedListId,
  selectedSmartList,
  onSelectSmartList,
  onSelectList,
  onAddList,
  onEditList,
  onDeleteList,
}: SidebarProps) {
  const [contextMenuId, setContextMenuId] = useState<number | null>(null);

  return (
    <aside className="w-[280px] h-screen flex flex-col border-r border-[var(--color-border-strong)] bg-[var(--color-bg-sidebar)] backdrop-blur-[20px] overflow-y-auto">
      <div className="p-4 pt-6">
        {/* Smart Lists */}
        <div className="grid grid-cols-2 gap-2">
          {SMART_LISTS.map((sl) => (
            <button
              key={sl.type}
              onClick={() => onSelectSmartList(sl.type)}
              className={`flex flex-col p-3 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:scale-[1.02] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-150 ${
                selectedSmartList === sl.type
                  ? "bg-[var(--color-bg-selected)]"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: sl.color }}
                >
                  {sl.icon}
                </div>
                <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {summary[sl.countKey]}
                </span>
              </div>
              <span className="text-[13px] text-[var(--color-text-secondary)] font-medium text-left">
                {sl.label}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-border-strong)] my-4" />

        {/* My Lists */}
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 px-2">
          My Lists
        </p>

        {lists.length === 0 ? (
          <p className="text-[13px] text-[var(--color-text-tertiary)] px-2 py-3">
            No lists yet
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {lists.map((list) => (
              <div key={list.id} className="relative">
                <button
                  onClick={() => onSelectList(list.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenuId(contextMenuId === list.id ? null : list.id);
                  }}
                  className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors duration-150 w-full ${
                    selectedListId === list.id
                      ? "bg-[var(--color-bg-selected)]"
                      : "hover:bg-[var(--color-bg-hover)]"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getColorHex(list.color) }}
                  />
                  <span className="flex-1 text-left text-[15px] text-[var(--color-text-primary)]">
                    {list.name}
                  </span>
                  <span className="text-[13px] text-[var(--color-text-secondary)]">
                    {list.count}
                  </span>
                </button>

                {/* Context Menu */}
                {contextMenuId === list.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setContextMenuId(null)}
                    />
                    <div className="absolute right-0 top-full z-50 bg-white rounded-lg shadow-lg border border-[var(--color-border)] py-1 min-w-[140px]">
                      <button
                        onClick={() => {
                          setContextMenuId(null);
                          onEditList(list);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] w-full"
                      >
                        <Pencil size={14} />
                        Edit List
                      </button>
                      <button
                        onClick={() => {
                          setContextMenuId(null);
                          onDeleteList(list.id);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-[13px] text-[var(--color-system-red)] hover:bg-[var(--color-bg-hover)] w-full"
                      >
                        <Trash2 size={14} />
                        Delete List
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Add List */}
      <button
        onClick={onAddList}
        className="flex items-center gap-1 px-6 py-4 text-[var(--color-system-blue)] font-medium text-[15px] hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <Plus size={16} />
        <span>Add List</span>
      </button>
    </aside>
  );
}
