package com.task_manager.demo;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String stage;
    private String importance;
    @Column(name = "user_id")
    private Long userId;

    public Task() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }
    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}