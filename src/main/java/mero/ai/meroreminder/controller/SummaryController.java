package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.service.ports.inp.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class SummaryController {

    private final ReminderService reminderService;

    @GetMapping
    public Map<String, Long> getSummary() {
        return reminderService.getSummary();
    }
}
