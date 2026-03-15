import { Reminder, ReminderListItem, Summary } from "@/types";

const API_BASE = "http://localhost:8080/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

// Reminders
export function fetchReminders(
  params?: Record<string, string>
): Promise<Reminder[]> {
  const query = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  return request<Reminder[]>(`/reminders${query}`);
}

export function createReminder(
  title: string,
  listId?: number | null
): Promise<Reminder> {
  return request<Reminder>("/reminders", {
    method: "POST",
    body: JSON.stringify({ title, listId }),
  });
}

export function updateReminder(
  id: number,
  data: Partial<Reminder>
): Promise<Reminder> {
  return request<Reminder>(`/reminders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function toggleReminder(id: number): Promise<Reminder> {
  return request<Reminder>(`/reminders/${id}/toggle`, {
    method: "PATCH",
  });
}

export function deleteReminder(id: number): Promise<void> {
  return request<void>(`/reminders/${id}`, {
    method: "DELETE",
  });
}

// Lists
export function fetchLists(): Promise<ReminderListItem[]> {
  return request<ReminderListItem[]>("/lists");
}

export function createList(
  name: string,
  color: string
): Promise<ReminderListItem> {
  return request<ReminderListItem>("/lists", {
    method: "POST",
    body: JSON.stringify({ name, color }),
  });
}

export function updateList(
  id: number,
  name: string,
  color: string
): Promise<ReminderListItem> {
  return request<ReminderListItem>(`/lists/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, color }),
  });
}

export function deleteList(id: number): Promise<void> {
  return request<void>(`/lists/${id}`, {
    method: "DELETE",
  });
}

// Summary
export function fetchSummary(): Promise<Summary> {
  return request<Summary>("/summary");
}
