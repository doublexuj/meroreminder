export type Priority = "NONE" | "LOW" | "MEDIUM" | "HIGH";

export interface Reminder {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
