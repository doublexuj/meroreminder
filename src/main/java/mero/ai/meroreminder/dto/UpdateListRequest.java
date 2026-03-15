package mero.ai.meroreminder.dto;

import jakarta.validation.constraints.Size;

public record UpdateListRequest(
        @Size(max = 100, message = "List name must be at most 100 characters")
        String name,
        @Size(max = 20, message = "Color must be at most 20 characters")
        String color
) {}
