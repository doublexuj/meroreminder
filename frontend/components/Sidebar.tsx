"use client";

import { Inbox } from "lucide-react";

interface SidebarProps {
  allCount: number;
}

export default function Sidebar({ allCount }: SidebarProps) {
  return (
    <aside className="w-[280px] min-h-screen flex flex-col border-r border-[var(--color-border-strong)] bg-[var(--color-bg-sidebar)] backdrop-blur-[20px]">
      <div className="p-4 pt-6">
        {/* Smart Lists */}
        <div className="grid grid-cols-2 gap-2">
          <button className="flex flex-col p-3 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:scale-[1.02] hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-all duration-150">
            <div className="flex items-center justify-between w-full mb-2">
              <div className="w-7 h-7 rounded-full bg-[var(--color-system-gray)] flex items-center justify-center">
                <Inbox size={16} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                {allCount}
              </span>
            </div>
            <span className="text-[13px] text-[var(--color-text-secondary)] font-medium">
              All
            </span>
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
}
