package mero.ai.meroreminder.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@NoArgsConstructor
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false, length = 500)
    private String title;

    @Setter
    @Column(length = 2000)
    private String memo;

    @Setter
    private LocalDate dueDate;

    @Setter
    private LocalTime dueTime;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Priority priority = Priority.NONE;

    @Setter
    private boolean flagged;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ReminderList reminderList;

    @Column(name = "list_id", insertable = false, updatable = false)
    @JsonProperty("listId")
    private Long listId;

    @Setter
    private boolean completed;

    @Setter
    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
