package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.dto.CreateReminderRequest;
import mero.ai.meroreminder.dto.ReminderResponse;
import mero.ai.meroreminder.dto.UpdateReminderRequest;
import mero.ai.meroreminder.service.ports.inp.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public Object findAll(
            @RequestParam(required = false) Long listId,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Boolean flagged,
            @RequestParam(required = false) Boolean dueToday,
            @RequestParam(required = false) Boolean scheduled,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page != null && size != null) {
            return reminderService.findAll(listId, completed, flagged, dueToday, scheduled, sort, PageRequest.of(page, size))
                    .map(ReminderResponse::from);
        }
        return reminderService.findAll(listId, completed, flagged, dueToday, scheduled, sort)
                .stream().map(ReminderResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ReminderResponse findById(@PathVariable Long id) {
        return ReminderResponse.from(reminderService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReminderResponse create(@Valid @RequestBody CreateReminderRequest request) {
        log.info("Creating reminder: title={}, listId={}", request.title(), request.listId());
        return ReminderResponse.from(reminderService.create(request.title(), request.listId()));
    }

    @PutMapping("/{id}")
    public ReminderResponse update(@PathVariable Long id, @Valid @RequestBody UpdateReminderRequest request) {
        log.info("Updating reminder: id={}", id);
        return ReminderResponse.from(reminderService.update(id, request));
    }

    @PatchMapping("/{id}/toggle")
    public ReminderResponse toggleComplete(@PathVariable Long id) {
        log.info("Toggling reminder: id={}", id);
        return ReminderResponse.from(reminderService.toggleComplete(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        log.info("Deleting reminder: id={}", id);
        reminderService.delete(id);
    }
}
