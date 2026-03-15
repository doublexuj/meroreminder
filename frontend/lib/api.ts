import { Reminder, ReminderListItem, Summary } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

async function requestVoid(
  path: string,
  options?: RequestInit
): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
}

function jsonBody(data: unknown): RequestInit {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
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
    ...jsonBody({ title, listId }),
  });
}

export function updateReminder(
  id: number,
  data: Partial<Reminder>
): Promise<Reminder> {
  return request<Reminder>(`/reminders/${id}`, {
    method: "PUT",
    ...jsonBody(data),
  });
}

export function toggleReminder(id: number): Promise<Reminder> {
  return request<Reminder>(`/reminders/${id}/toggle`, {
    method: "PATCH",
  });
}

export function deleteReminder(id: number): Promise<void> {
  return requestVoid(`/reminders/${id}`, {
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
    ...jsonBody({ name, color }),
  });
}

export function updateList(
  id: number,
  name: string,
  color: string
): Promise<ReminderListItem> {
  return request<ReminderListItem>(`/lists/${id}`, {
    method: "PUT",
    ...jsonBody({ name, color }),
  });
}

export function deleteList(id: number): Promise<void> {
  return requestVoid(`/lists/${id}`, {
    method: "DELETE",
  });
}

// Summary
export function fetchSummary(): Promise<Summary> {
  return request<Summary>("/summary");
}
