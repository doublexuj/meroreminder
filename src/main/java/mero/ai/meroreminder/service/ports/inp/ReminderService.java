package mero.ai.meroreminder.service.ports.inp;

import mero.ai.meroreminder.domain.Reminder;

import java.util.List;
import java.util.Map;

public interface ReminderService {

    List<Reminder> findAll(Boolean completed, Boolean flagged, Boolean dueToday, Boolean scheduled, String sort);

    Reminder findById(Long id);

    Reminder create(String title);

    Reminder update(Long id, Map<String, Object> fields);

    Reminder toggleComplete(Long id);

    void delete(Long id);

    Map<String, Long> getSummary();
}
