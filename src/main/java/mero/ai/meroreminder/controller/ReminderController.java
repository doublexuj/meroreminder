package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.service.ports.inp.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public List<Reminder> findAll(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Boolean flagged,
            @RequestParam(required = false) Boolean dueToday,
            @RequestParam(required = false) Boolean scheduled,
            @RequestParam(required = false) String sort) {
        return reminderService.findAll(completed, flagged, dueToday, scheduled, sort);
    }

    @GetMapping("/{id}")
    public Reminder findById(@PathVariable Long id) {
        return reminderService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reminder create(@RequestBody Map<String, String> body) {
        return reminderService.create(body.get("title"));
    }

    @PutMapping("/{id}")
    public Reminder update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return reminderService.update(id, body);
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
