package mero.ai.meroreminder.service;

import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.service.ports.inp.ReminderService;
import mero.ai.meroreminder.repository.ReminderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderService implements ReminderService {

    private final ReminderRepository reminderRepository;

    @Override
    public List<Reminder> findAll() {
        return reminderRepository.findAll();
    }

    @Override
    public Reminder findById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found: " + id));
    }

    @Override
    @Transactional
    public Reminder create(String title) {
        Reminder reminder = new Reminder();
        reminder.setTitle(title);
        return reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public Reminder update(Long id, String title) {
        Reminder reminder = findById(id);
        reminder.setTitle(title);
        return reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public Reminder toggleComplete(Long id) {
        Reminder reminder = findById(id);
        reminder.setCompleted(!reminder.isCompleted());
        return reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Reminder reminder = findById(id);
        reminderRepository.delete(reminder);
    }
}
