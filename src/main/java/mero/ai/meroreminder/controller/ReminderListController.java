package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.domain.ReminderList;
import mero.ai.meroreminder.service.ports.inp.ReminderListService;
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
    public ReminderList create(@RequestBody Map<String, String> body) {
        return reminderListService.create(body.get("name"), body.get("color"));
    }

    @PutMapping("/{id}")
    public ReminderList update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return reminderListService.update(id, body.get("name"), body.get("color"));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        reminderListService.delete(id);
    }
}
