package mero.ai.meroreminder.repository;

import mero.ai.meroreminder.domain.ReminderList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReminderListRepository extends JpaRepository<ReminderList, Long> {

    @Query("SELECT l.id, l.name, l.color, l.createdAt, l.updatedAt, " +
           "COALESCE(SUM(CASE WHEN r.completed = false THEN 1 ELSE 0 END), 0) " +
           "FROM ReminderList l LEFT JOIN Reminder r ON r.reminderList = l " +
           "GROUP BY l.id, l.name, l.color, l.createdAt, l.updatedAt " +
           "ORDER BY l.createdAt")
    List<Object[]> findAllWithIncompleteCount();
}
