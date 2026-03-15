package mero.ai.meroreminder.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.format.DateTimeParseException;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        String message = e.getMessage();
        HttpStatus status = message != null && message.contains("not found")
                ? HttpStatus.NOT_FOUND
                : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status)
                .body(Map.of("error", message != null ? message : "Bad request"));
    }

    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<Map<String, String>> handleDateTimeParse(DateTimeParseException e) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid date/time format: " + e.getParsedString()));
    }

    @ExceptionHandler(ClassCastException.class)
    public ResponseEntity<Map<String, String>> handleClassCast(ClassCastException e) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "Invalid field type in request body"));
    }
}
