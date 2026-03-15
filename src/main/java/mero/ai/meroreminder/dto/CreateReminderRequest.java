package mero.ai.meroreminder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateReminderRequest(
        @NotBlank(message = "Title must not be empty")
        @Size(max = 500, message = "Title must be at most 500 characters")
        String title,
        Long listId
) {}
