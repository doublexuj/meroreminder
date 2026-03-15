package mero.ai.meroreminder.service;

import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReminderService {

    private final ReminderRepository reminderRepository;

    public List<Reminder> findAll() {
        return reminderRepository.findAll();
    }

    public Reminder findById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found: " + id));
    }

    @Transactional
    public Reminder create(String title) {
        Reminder reminder = new Reminder();
        reminder.setTitle(title);
        return reminderRepository.save(reminder);
    }

    @Transactional
    public Reminder update(Long id, String title) {
        Reminder reminder = findById(id);
        reminder.setTitle(title);
        return reminderRepository.save(reminder);
    }

    @Transactional
    public Reminder toggleComplete(Long id) {
        Reminder reminder = findById(id);
        reminder.setCompleted(!reminder.isCompleted());
        return reminderRepository.save(reminder);
    }

    @Transactional
    public void delete(Long id) {
        Reminder reminder = findById(id);
        reminderRepository.delete(reminder);
    }
}
