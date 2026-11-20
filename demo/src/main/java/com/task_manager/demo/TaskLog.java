package com.task_manager.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_logs")
public class TaskLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long taskId;
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();

    public TaskLog() {}

    public TaskLog(Long taskId, String message) {
        this.taskId = taskId;
        this.message = message;
    }

    public Long getId() { return id; }
    public Long getTaskId() { return taskId; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}