package mero.ai.meroreminder.repository;

import mero.ai.meroreminder.domain.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    List<Reminder> findByReminderListId(Long listId);

    List<Reminder> findByReminderListIdAndCompleted(Long listId, boolean completed);

    long countByReminderListIdAndCompleted(Long listId, boolean completed);

    @Modifying
    void deleteByReminderListId(Long listId);

    @Query("SELECT " +
           "COALESCE(SUM(CASE WHEN r.dueDate = :today AND r.completed = false THEN 1 ELSE 0 END), 0), " +
           "COALESCE(SUM(CASE WHEN r.dueDate IS NOT NULL AND r.completed = false THEN 1 ELSE 0 END), 0), " +
           "COALESCE(SUM(CASE WHEN r.completed = false THEN 1 ELSE 0 END), 0), " +
           "COALESCE(SUM(CASE WHEN r.flagged = true AND r.completed = false THEN 1 ELSE 0 END), 0), " +
           "COALESCE(SUM(CASE WHEN r.completed = true THEN 1 ELSE 0 END), 0) " +
           "FROM Reminder r")
    List<Object[]> getSummaryCounts(@Param("today") LocalDate today);
}
