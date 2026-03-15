package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.domain.Reminder;
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
class ReminderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReminderRepository reminderRepository;

    @BeforeEach
    void setUp() {
        reminderRepository.deleteAll();
    }

    @Test
    @Order(1)
    @DisplayName("POST /api/reminders — 리마인더 생성")
    void createReminder() throws Exception {
        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"장보기\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("장보기"))
                .andExpect(jsonPath("$.completed").value(false))
                .andExpect(jsonPath("$.createdAt").isNotEmpty());
    }

    @Test
    @Order(2)
    @DisplayName("GET /api/reminders — 전체 리마인더 조회")
    void findAll() throws Exception {
        createTestReminder("운동하기");
        createTestReminder("공부하기");

        mockMvc.perform(get("/api/reminders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title").value("운동하기"))
                .andExpect(jsonPath("$[1].title").value("공부하기"));
    }

    @Test
    @Order(3)
    @DisplayName("GET /api/reminders/{id} — 단일 리마인더 조회")
    void findById() throws Exception {
        Reminder saved = createTestReminder("회의 준비");

        mockMvc.perform(get("/api/reminders/{id}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.title").value("회의 준비"));
    }

    @Test
    @Order(4)
    @DisplayName("PUT /api/reminders/{id} — 리마인더 수정")
    void updateReminder() throws Exception {
        Reminder saved = createTestReminder("장보기");

        mockMvc.perform(put("/api/reminders/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"마트 가기\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(saved.getId()))
                .andExpect(jsonPath("$.title").value("마트 가기"));
    }

    @Test
    @Order(5)
    @DisplayName("PATCH /api/reminders/{id}/toggle — 완료 상태 토글")
    void toggleComplete() throws Exception {
        Reminder saved = createTestReminder("운동하기");

        // 미완료 → 완료
        mockMvc.perform(patch("/api/reminders/{id}/toggle", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true));

        // 완료 → 미완료
        mockMvc.perform(patch("/api/reminders/{id}/toggle", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(false));
    }

    @Test
    @Order(6)
    @DisplayName("DELETE /api/reminders/{id} — 리마인더 삭제")
    void deleteReminder() throws Exception {
        Reminder saved = createTestReminder("삭제할 리마인더");

        mockMvc.perform(delete("/api/reminders/{id}", saved.getId()))
                .andExpect(status().isNoContent());

        // 삭제 후 목록에서 제거 확인
        mockMvc.perform(get("/api/reminders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    private Reminder createTestReminder(String title) {
        Reminder reminder = new Reminder();
        reminder.setTitle(title);
        return reminderRepository.save(reminder);
    }
}
