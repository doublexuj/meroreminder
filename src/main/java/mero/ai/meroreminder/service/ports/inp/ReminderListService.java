package mero.ai.meroreminder.service.ports.inp;

import mero.ai.meroreminder.domain.ReminderList;

import java.util.List;
import java.util.Map;

public interface ReminderListService {

    List<Map<String, Object>> findAllWithCount();

    ReminderList findById(Long id);

    ReminderList create(String name, String color);

    ReminderList update(Long id, String name, String color);

    void delete(Long id);
}
