package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.domain.ReminderList;
import mero.ai.meroreminder.repository.ReminderListRepository;
import mero.ai.meroreminder.repository.ReminderRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ReminderListControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReminderListRepository reminderListRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    @BeforeEach
    void setUp() {
        reminderRepository.deleteAll();
        reminderListRepository.deleteAll();
    }

    @Test
    @Order(1)
    @DisplayName("POST /api/lists — 리스트 생성")
    void createList() throws Exception {
        mockMvc.perform(post("/api/lists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"개인\", \"color\": \"BLUE\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("개인"))
                .andExpect(jsonPath("$.color").value("BLUE"));
    }

    @Test
    @Order(2)
    @DisplayName("GET /api/lists — 리스트 목록 (카운트 포함)")
    void findAllWithCount() throws Exception {
        ReminderList list = createTestList("업무", "RED");

        Reminder r1 = new Reminder();
        r1.setTitle("할일1");
        r1.setReminderList(list);
        reminderRepository.save(r1);

        Reminder r2 = new Reminder();
        r2.setTitle("할일2");
        r2.setReminderList(list);
        r2.setCompleted(true);
        reminderRepository.save(r2);

        mockMvc.perform(get("/api/lists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("업무"))
                .andExpect(jsonPath("$[0].count").value(1));
    }

    @Test
    @Order(3)
    @DisplayName("PUT /api/lists/{id} — 리스트 수정")
    void updateList() throws Exception {
        ReminderList list = createTestList("개인", "BLUE");

        mockMvc.perform(put("/api/lists/{id}", list.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\": \"가정\", \"color\": \"GREEN\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("가정"))
                .andExpect(jsonPath("$.color").value("GREEN"));
    }

    @Test
    @Order(4)
    @DisplayName("DELETE /api/lists/{id} — 리스트 삭제 (cascade)")
    void deleteListCascade() throws Exception {
        ReminderList list = createTestList("삭제할리스트", "RED");

        Reminder r = new Reminder();
        r.setTitle("리스트내 리마인더");
        r.setReminderList(list);
        reminderRepository.save(r);

        mockMvc.perform(delete("/api/lists/{id}", list.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/lists"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        mockMvc.perform(get("/api/reminders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @Order(5)
    @DisplayName("GET /api/reminders?listId= — 리스트별 리마인더 조회")
    void filterByListId() throws Exception {
        ReminderList list1 = createTestList("개인", "BLUE");
        ReminderList list2 = createTestList("업무", "RED");

        Reminder r1 = new Reminder();
        r1.setTitle("개인할일");
        r1.setReminderList(list1);
        reminderRepository.save(r1);

        Reminder r2 = new Reminder();
        r2.setTitle("업무할일");
        r2.setReminderList(list2);
        reminderRepository.save(r2);

        mockMvc.perform(get("/api/reminders").param("listId", list1.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("개인할일"));
    }

    @Test
    @Order(6)
    @DisplayName("POST /api/reminders — listId 지정하여 생성")
    void createReminderWithListId() throws Exception {
        ReminderList list = createTestList("업무", "RED");

        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"회의\", \"listId\": " + list.getId() + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("회의"))
                .andExpect(jsonPath("$.listId").value(list.getId()));
    }

    private ReminderList createTestList(String name, String color) {
        ReminderList list = new ReminderList();
        list.setName(name);
        list.setColor(color);
        return reminderListRepository.save(list);
    }
}
