package mero.ai.meroreminder.dto;

import jakarta.validation.constraints.Size;

public record UpdateReminderRequest(
        @Size(max = 500, message = "Title must be at most 500 characters")
        String title,
        @Size(max = 2000, message = "Memo must be at most 2000 characters")
        String memo,
        String dueDate,
        String dueTime,
        String priority,
        Boolean flagged,
        Long listId
) {}
