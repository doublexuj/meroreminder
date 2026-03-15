package mero.ai.meroreminder.dto;

import mero.ai.meroreminder.domain.Reminder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReminderResponse(
        Long id,
        String title,
        String memo,
        LocalDate dueDate,
        LocalTime dueTime,
        String priority,
        boolean flagged,
        boolean completed,
        LocalDateTime completedAt,
        Long listId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReminderResponse from(Reminder reminder) {
        return new ReminderResponse(
                reminder.getId(),
                reminder.getTitle(),
                reminder.getMemo(),
                reminder.getDueDate(),
                reminder.getDueTime(),
                reminder.getPriority().name(),
                reminder.isFlagged(),
                reminder.isCompleted(),
                reminder.getCompletedAt(),
                reminder.getListId(),
                reminder.getCreatedAt(),
                reminder.getUpdatedAt()
        );
    }
}
