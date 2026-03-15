package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.domain.ReminderList;
import mero.ai.meroreminder.dto.CreateListRequest;
import mero.ai.meroreminder.dto.UpdateListRequest;
import mero.ai.meroreminder.service.ports.inp.ReminderListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ReminderListController {

    private final ReminderListService reminderListService;

    @GetMapping
    public List<Map<String, Object>> findAll() {
        return reminderListService.findAllWithCount();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReminderList create(@Valid @RequestBody CreateListRequest request) {
        return reminderListService.create(request.name(), request.color());
    }

    @PutMapping("/{id}")
    public ReminderList update(@PathVariable Long id, @Valid @RequestBody UpdateListRequest request) {
        return reminderListService.update(id, request.name(), request.color());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        reminderListService.delete(id);
    }
}
