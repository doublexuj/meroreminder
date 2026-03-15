package mero.ai.meroreminder.controller;

import mero.ai.meroreminder.domain.Priority;
import mero.ai.meroreminder.domain.Reminder;
import mero.ai.meroreminder.repository.ReminderRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

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
    @DisplayName("PUT /api/reminders/{id} — 리마인더 수정 (제목, 메모, 우선순위)")
    void updateReminder() throws Exception {
        Reminder saved = createTestReminder("장보기");

        mockMvc.perform(put("/api/reminders/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\": \"마트 가기\", \"memo\": \"우유, 계란\", \"priority\": \"HIGH\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("마트 가기"))
                .andExpect(jsonPath("$.memo").value("우유, 계란"))
                .andExpect(jsonPath("$.priority").value("HIGH"));
    }

    @Test
    @Order(5)
    @DisplayName("PUT /api/reminders/{id} — 마감일, 마감시간, 플래그 수정")
    void updateReminderDateAndFlag() throws Exception {
        Reminder saved = createTestReminder("회의");

        mockMvc.perform(put("/api/reminders/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dueDate\": \"2026-03-20\", \"dueTime\": \"14:00\", \"flagged\": true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dueDate").value("2026-03-20"))
                .andExpect(jsonPath("$.dueTime").value("14:00:00"))
                .andExpect(jsonPath("$.flagged").value(true));
    }

    @Test
    @Order(6)
    @DisplayName("PATCH /api/reminders/{id}/toggle — 완료 상태 토글 + completedAt")
    void toggleComplete() throws Exception {
        Reminder saved = createTestReminder("운동하기");

        // 미완료 → 완료
        mockMvc.perform(patch("/api/reminders/{id}/toggle", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(true))
                .andExpect(jsonPath("$.completedAt").isNotEmpty());

        // 완료 → 미완료
        mockMvc.perform(patch("/api/reminders/{id}/toggle", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed").value(false))
                .andExpect(jsonPath("$.completedAt").isEmpty());
    }

    @Test
    @Order(7)
    @DisplayName("DELETE /api/reminders/{id} — 리마인더 삭제")
    void deleteReminder() throws Exception {
        Reminder saved = createTestReminder("삭제할 리마인더");

        mockMvc.perform(delete("/api/reminders/{id}", saved.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/reminders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @Order(8)
    @DisplayName("GET /api/reminders?completed=false — 미완료 필터")
    void filterByCompleted() throws Exception {
        Reminder r1 = createTestReminder("미완료");
        Reminder r2 = createTestReminder("완료됨");
        r2.setCompleted(true);
        reminderRepository.save(r2);

        mockMvc.perform(get("/api/reminders").param("completed", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("미완료"));
    }

    @Test
    @Order(9)
    @DisplayName("GET /api/reminders?flagged=true — 플래그 필터")
    void filterByFlagged() throws Exception {
        Reminder r1 = createTestReminder("일반");
        Reminder r2 = createTestReminder("중요");
        r2.setFlagged(true);
        reminderRepository.save(r2);

        mockMvc.perform(get("/api/reminders").param("flagged", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("중요"));
    }

    @Test
    @Order(10)
    @DisplayName("GET /api/reminders?dueToday=true — 오늘 마감 필터")
    void filterByDueToday() throws Exception {
        Reminder r1 = createTestReminder("오늘");
        r1.setDueDate(LocalDate.now());
        reminderRepository.save(r1);

        Reminder r2 = createTestReminder("내일");
        r2.setDueDate(LocalDate.now().plusDays(1));
        reminderRepository.save(r2);

        mockMvc.perform(get("/api/reminders").param("dueToday", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("오늘"));
    }

    @Test
    @Order(11)
    @DisplayName("GET /api/reminders?scheduled=true — 마감일 있는 것만")
    void filterByScheduled() throws Exception {
        createTestReminder("마감없음");
        Reminder r2 = createTestReminder("마감있음");
        r2.setDueDate(LocalDate.now().plusDays(3));
        reminderRepository.save(r2);

        mockMvc.perform(get("/api/reminders").param("scheduled", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("마감있음"));
    }

    @Test
    @Order(12)
    @DisplayName("GET /api/summary — 스마트 리스트 카운트")
    void summary() throws Exception {
        Reminder r1 = createTestReminder("오늘할일");
        r1.setDueDate(LocalDate.now());
        reminderRepository.save(r1);

        Reminder r2 = createTestReminder("중요");
        r2.setFlagged(true);
        reminderRepository.save(r2);

        Reminder r3 = createTestReminder("완료됨");
        r3.setCompleted(true);
        reminderRepository.save(r3);

        mockMvc.perform(get("/api/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.today").value(1))
                .andExpect(jsonPath("$.scheduled").value(1))
                .andExpect(jsonPath("$.all").value(2))
                .andExpect(jsonPath("$.flagged").value(1))
                .andExpect(jsonPath("$.completed").value(1));
    }

    @Test
    @Order(13)
    @DisplayName("PUT /api/reminders/{id} — 잘못된 priority 값 → 400")
    void updateWithInvalidPriority() throws Exception {
        Reminder saved = createTestReminder("테스트");

        mockMvc.perform(put("/api/reminders/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"priority\": \"URGENT\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(14)
    @DisplayName("PUT /api/reminders/{id} — 잘못된 날짜 형식 → 400")
    void updateWithInvalidDate() throws Exception {
        Reminder saved = createTestReminder("테스트");

        mockMvc.perform(put("/api/reminders/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dueDate\": \"not-a-date\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(15)
    @DisplayName("POST /api/reminders — title 없이 생성 → 400")
    void createWithoutTitle() throws Exception {
        mockMvc.perform(post("/api/reminders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"memo\": \"메모만\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Order(16)
    @DisplayName("GET /api/reminders/{id} — 존재하지 않는 ID → 404")
    void findByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/reminders/{id}", 99999))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(17)
    @DisplayName("GET /api/reminders?page=0&size=2 — 페이지네이션 지원")
    void findAllWithPagination() throws Exception {
        createTestReminder("할일1");
        createTestReminder("할일2");
        createTestReminder("할일3");

        mockMvc.perform(get("/api/reminders").param("page", "0").param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements").value(3))
                .andExpect(jsonPath("$.totalPages").value(2));

        mockMvc.perform(get("/api/reminders").param("page", "1").param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));
    }

    private Reminder createTestReminder(String title) {
        Reminder reminder = new Reminder();
        reminder.setTitle(title);
        return reminderRepository.save(reminder);
    }
}
