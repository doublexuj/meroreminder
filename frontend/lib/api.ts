import { Reminder, Summary } from "@/types";

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

export function fetchReminders(
  params?: Record<string, string>
): Promise<Reminder[]> {
  const query = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  return request<Reminder[]>(`/reminders${query}`);
}

export function createReminder(title: string): Promise<Reminder> {
  return request<Reminder>("/reminders", {
    method: "POST",
    body: JSON.stringify({ title }),
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

export function fetchSummary(): Promise<Summary> {
  return request<Summary>("/summary");
}
