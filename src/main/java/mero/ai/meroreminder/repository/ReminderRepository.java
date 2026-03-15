package mero.ai.meroreminder.repository;

import mero.ai.meroreminder.domain.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByCompleted(boolean completed);

    List<Reminder> findByFlaggedAndCompleted(boolean flagged, boolean completed);

    List<Reminder> findByDueDateAndCompleted(LocalDate dueDate, boolean completed);

    List<Reminder> findByDueDateNotNullAndCompleted(boolean completed);

    long countByCompleted(boolean completed);

    long countByFlaggedAndCompleted(boolean flagged, boolean completed);

    long countByDueDateAndCompleted(LocalDate dueDate, boolean completed);

    long countByDueDateNotNullAndCompleted(boolean completed);
}
