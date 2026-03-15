package mero.ai.meroreminder.service;

import mero.ai.meroreminder.domain.Priority;
import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.domain.ReminderList;
import mero.ai.meroreminder.service.ports.inp.ReminderService;
import mero.ai.meroreminder.repository.ReminderListRepository;
import mero.ai.meroreminder.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderService implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final ReminderListRepository reminderListRepository;

    @Override
    public List<Reminder> findAll(Long listId, Boolean completed, Boolean flagged, Boolean dueToday, Boolean scheduled, String sort) {
        List<Reminder> results;

        if (listId != null) {
            if (completed != null) {
                results = reminderRepository.findByReminderListIdAndCompleted(listId, completed);
            } else {
                results = reminderRepository.findByReminderListId(listId);
            }
        } else if (Boolean.TRUE.equals(dueToday)) {
            results = reminderRepository.findByDueDateAndCompleted(LocalDate.now(), false);
        } else if (Boolean.TRUE.equals(scheduled)) {
            results = reminderRepository.findByDueDateNotNullAndCompleted(false);
        } else if (Boolean.TRUE.equals(flagged)) {
            results = reminderRepository.findByFlaggedAndCompleted(true, false);
        } else if (completed != null) {
            results = reminderRepository.findByCompleted(completed);
        } else {
            results = reminderRepository.findAll();
        }

        if (sort != null) {
            Comparator<Reminder> comparator = switch (sort) {
                case "dueDate" -> Comparator.comparing(Reminder::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()));
                case "priority" -> Comparator.comparing(Reminder::getPriority, Comparator.reverseOrder());
                default -> Comparator.comparing(Reminder::getCreatedAt);
            };
            results = new ArrayList<>(results);
            results.sort(comparator);
        }

        return results;
    }

    @Override
    public Reminder findById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found: " + id));
    }

    @Override
    @Transactional
    public Reminder create(String title, Long listId) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title must not be empty");
        }
        Reminder reminder = new Reminder();
        reminder.setTitle(title);
        if (listId != null) {
            ReminderList list = reminderListRepository.findById(listId)
                    .orElseThrow(() -> new IllegalArgumentException("List not found: " + listId));
            reminder.setReminderList(list);
        }
        return reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public Reminder update(Long id, Map<String, Object> fields) {
        Reminder reminder = findById(id);

        if (fields.containsKey("title")) {
            reminder.setTitle((String) fields.get("title"));
        }
        if (fields.containsKey("memo")) {
            reminder.setMemo((String) fields.get("memo"));
        }
        if (fields.containsKey("dueDate")) {
            String val = (String) fields.get("dueDate");
            reminder.setDueDate(val != null && !val.isEmpty() ? LocalDate.parse(val) : null);
        }
        if (fields.containsKey("dueTime")) {
            String val = (String) fields.get("dueTime");
            reminder.setDueTime(val != null && !val.isEmpty() ? LocalTime.parse(val) : null);
        }
        if (fields.containsKey("priority")) {
            reminder.setPriority(Priority.valueOf((String) fields.get("priority")));
        }
        if (fields.containsKey("flagged")) {
            reminder.setFlagged((Boolean) fields.get("flagged"));
        }
        if (fields.containsKey("listId")) {
            Object listIdVal = fields.get("listId");
            if (listIdVal != null) {
                Long lid = ((Number) listIdVal).longValue();
                ReminderList list = reminderListRepository.findById(lid)
                        .orElseThrow(() -> new IllegalArgumentException("List not found: " + lid));
                reminder.setReminderList(list);
            } else {
                reminder.setReminderList(null);
            }
        }

        return reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public Reminder toggleComplete(Long id) {
        Reminder reminder = findById(id);
        boolean newState = !reminder.isCompleted();
        reminder.setCompleted(newState);
        reminder.setCompletedAt(newState ? LocalDateTime.now() : null);
        return reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Reminder reminder = findById(id);
        reminderRepository.delete(reminder);
    }

    @Override
    public Map<String, Long> getSummary() {
        LocalDate today = LocalDate.now();
        Map<String, Long> summary = new LinkedHashMap<>();
        summary.put("today", reminderRepository.countByDueDateAndCompleted(today, false));
        summary.put("scheduled", reminderRepository.countByDueDateNotNullAndCompleted(false));
        summary.put("all", reminderRepository.countByCompleted(false));
        summary.put("flagged", reminderRepository.countByFlaggedAndCompleted(true, false));
        summary.put("completed", reminderRepository.countByCompleted(true));
        return summary;
    }
}
