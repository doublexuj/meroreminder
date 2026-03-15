package mero.ai.meroreminder.repository;

import mero.ai.meroreminder.domain.ReminderList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderListRepository extends JpaRepository<ReminderList, Long> {
}
