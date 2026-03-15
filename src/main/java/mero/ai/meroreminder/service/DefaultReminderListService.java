package mero.ai.meroreminder.service;

import mero.ai.meroreminder.domain.ReminderList;
import mero.ai.meroreminder.repository.ReminderListRepository;
import mero.ai.meroreminder.repository.ReminderRepository;
import mero.ai.meroreminder.service.ports.inp.ReminderListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderListService implements ReminderListService {

    private final ReminderListRepository reminderListRepository;
    private final ReminderRepository reminderRepository;

    @Override
    public List<Map<String, Object>> findAllWithCount() {
        List<ReminderList> lists = reminderListRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (ReminderList list : lists) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", list.getId());
            map.put("name", list.getName());
            map.put("color", list.getColor());
            map.put("count", reminderRepository.countByReminderListIdAndCompleted(list.getId(), false));
            map.put("createdAt", list.getCreatedAt());
            map.put("updatedAt", list.getUpdatedAt());
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
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("List name must not be empty");
        }
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
        ReminderList list = findById(id);
        reminderRepository.deleteByReminderListId(id);
        reminderListRepository.delete(list);
    }
}
