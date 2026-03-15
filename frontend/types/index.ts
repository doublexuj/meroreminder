export type Priority = "NONE" | "LOW" | "MEDIUM" | "HIGH";

export interface Reminder {
  id: number;
  title: string;
  memo: string | null;
  dueDate: string | null;
  dueTime: string | null;
  priority: Priority;
  flagged: boolean;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  today: number;
  scheduled: number;
  all: number;
  flagged: number;
  completed: number;
}
