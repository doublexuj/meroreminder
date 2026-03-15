package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.dto.CreateReminderRequest;
import mero.ai.meroreminder.dto.UpdateReminderRequest;
import mero.ai.meroreminder.service.ports.inp.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public List<Reminder> findAll(
            @RequestParam(required = false) Long listId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Boolean flagged,
            @RequestParam(required = false) Boolean dueToday,
            @RequestParam(required = false) Boolean scheduled,
            @RequestParam(required = false) String sort) {
        return reminderService.findAll(listId, completed, flagged, dueToday, scheduled, sort);
    }

    @GetMapping("/{id}")
    public Reminder findById(@PathVariable Long id) {
        return reminderService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reminder create(@Valid @RequestBody CreateReminderRequest request) {
        return reminderService.create(request.title(), request.listId());
    }

    @PutMapping("/{id}")
    public Reminder update(@PathVariable Long id, @Valid @RequestBody UpdateReminderRequest request) {
        return reminderService.update(id, request);
    }

    @PatchMapping("/{id}/toggle")
    public Reminder toggleComplete(@PathVariable Long id) {
        return reminderService.toggleComplete(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        reminderService.delete(id);
    }
}
