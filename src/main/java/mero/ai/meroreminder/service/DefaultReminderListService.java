package mero.ai.meroreminder.service;

import mero.ai.meroreminder.domain.ReminderList;
import mero.ai.meroreminder.repository.ReminderListRepository;
import mero.ai.meroreminder.repository.ReminderRepository;
import mero.ai.meroreminder.service.ports.inp.ReminderListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderListService implements ReminderListService {

    private final ReminderListRepository reminderListRepository;
    private final ReminderRepository reminderRepository;

    @Override
    public List<Map<String, Object>> findAllWithCount() {
        List<Object[]> rows = reminderListRepository.findAllWithIncompleteCount();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", row[0]);
            map.put("name", row[1]);
            map.put("color", row[2]);
            map.put("createdAt", row[3]);
            map.put("updatedAt", row[4]);
            map.put("count", row[5]);
            result.add(map);
        }
        return result;
    }

    @Override
    public ReminderList findById(Long id) {
        return reminderListRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("List not found: " + id));
    }

    @Override
    @Transactional
    public ReminderList create(String name, String color) {
        log.debug("Creating list: name={}, color={}", name, color);
        ReminderList list = new ReminderList();
        list.setName(name);
        list.setColor(color != null ? color : "BLUE");
        return reminderListRepository.save(list);
    }

    @Override
    @Transactional
    public ReminderList update(Long id, String name, String color) {
        ReminderList list = findById(id);
        if (name != null) list.setName(name);
        if (color != null) list.setColor(color);
        return reminderListRepository.save(list);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.debug("Deleting list: id={}", id);
        ReminderList list = findById(id);
        reminderRepository.deleteByReminderListId(id);
        reminderListRepository.delete(list);
    }
}
