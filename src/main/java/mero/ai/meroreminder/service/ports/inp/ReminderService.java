package mero.ai.meroreminder.service.ports.inp;

import mero.ai.meroreminder.domain.Reminder;

import java.util.List;

public interface ReminderService {

    List<Reminder> findAll();

    Reminder findById(Long id);

    Reminder create(String title);

    Reminder update(Long id, String title);

    Reminder toggleComplete(Long id);

    void delete(Long id);
}
