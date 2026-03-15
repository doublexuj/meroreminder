package mero.ai.meroreminder.service;

import mero.ai.meroreminder.domain.Priority;
import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.domain.ReminderList;
import mero.ai.meroreminder.dto.UpdateReminderRequest;
import mero.ai.meroreminder.service.ports.inp.ReminderService;
import mero.ai.meroreminder.repository.ReminderListRepository;
import mero.ai.meroreminder.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Sort;

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
            Sort dbSort = switch (sort) {
                case "dueDate" -> Sort.by(Sort.Order.asc("dueDate").nullsLast());
                case "priority" -> Sort.by(Sort.Order.desc("priority"));
                default -> Sort.by(Sort.Order.asc("createdAt"));
            };
            results = new ArrayList<>(results);
            // Re-fetch with sort when no specific filter was applied
            if (listId == null && completed == null && !Boolean.TRUE.equals(dueToday)
                    && !Boolean.TRUE.equals(scheduled) && !Boolean.TRUE.equals(flagged)) {
                results = reminderRepository.findAll(dbSort);
            } else {
                // For filtered queries, sort in memory as Spring Data derived queries don't accept Sort
                Comparator<Reminder> comparator = switch (sort) {
                    case "dueDate" -> Comparator.comparing(Reminder::getDueDate, Comparator.nullsLast(Comparator.naturalOrder()));
                    case "priority" -> Comparator.comparing(Reminder::getPriority, Comparator.reverseOrder());
                    default -> Comparator.comparing(Reminder::getCreatedAt);
                };
                results.sort(comparator);
            }
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
    public Reminder update(Long id, UpdateReminderRequest request) {
        Reminder reminder = findById(id);

        if (request.title() != null) {
            reminder.setTitle(request.title());
        }
        if (request.memo() != null) {
            reminder.setMemo(request.memo().isEmpty() ? null : request.memo());
        }
        if (request.dueDate() != null) {
            reminder.setDueDate(request.dueDate().isEmpty() ? null : LocalDate.parse(request.dueDate()));
        }
        if (request.dueTime() != null) {
            reminder.setDueTime(request.dueTime().isEmpty() ? null : LocalTime.parse(request.dueTime()));
        }
        if (request.priority() != null) {
            reminder.setPriority(Priority.valueOf(request.priority()));
        }
        if (request.flagged() != null) {
            reminder.setFlagged(request.flagged());
        }
        if (request.listId() != null) {
            if (request.listId() == 0) {
                reminder.setReminderList(null);
            } else {
                ReminderList list = reminderListRepository.findById(request.listId())
                        .orElseThrow(() -> new IllegalArgumentException("List not found: " + request.listId()));
                reminder.setReminderList(list);
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
        List<Object[]> rows = reminderRepository.getSummaryCounts(LocalDate.now());
        Object[] counts = rows.get(0);
        Map<String, Long> summary = new LinkedHashMap<>();
        summary.put("today", ((Number) counts[0]).longValue());
        summary.put("scheduled", ((Number) counts[1]).longValue());
        summary.put("all", ((Number) counts[2]).longValue());
        summary.put("flagged", ((Number) counts[3]).longValue());
        summary.put("completed", ((Number) counts[4]).longValue());
        return summary;
    }
}
