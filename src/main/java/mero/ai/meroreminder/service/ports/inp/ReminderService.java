package mero.ai.meroreminder.service.ports.inp;

import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.dto.UpdateReminderRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface ReminderService {

    List<Reminder> findAll(Long listId, Boolean completed, Boolean flagged, Boolean dueToday, Boolean scheduled, String sort);

    Page<Reminder> findAll(Long listId, Boolean completed, Boolean flagged, Boolean dueToday, Boolean scheduled, String sort, Pageable pageable);

    Reminder findById(Long id);

    Reminder create(String title, Long listId);

    Reminder update(Long id, UpdateReminderRequest request);

    Reminder toggleComplete(Long id);

    void delete(Long id);

    Map<String, Long> getSummary();
}
