package mero.ai.meroreminder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateListRequest(
        @NotBlank(message = "List name must not be empty")
        @Size(max = 100, message = "List name must be at most 100 characters")
        String name,
        @Size(max = 20, message = "Color must be at most 20 characters")
        String color
) {}
