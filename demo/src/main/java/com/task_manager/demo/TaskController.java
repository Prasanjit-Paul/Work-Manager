package com.task_manager.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskLogRepository taskLogRepository; // NEW: Inject the log repository

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));

        // NEW: Check if the stage has changed at all, no matter which column it comes from
        if (!task.getStage().equals(taskDetails.getStage())) {
            String logMessage = "Moved from " + task.getStage() + " to " + taskDetails.getStage();
            taskLogRepository.save(new TaskLog(id, logMessage));
        }

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStage(taskDetails.getStage());
        task.setImportance(taskDetails.getImportance());

        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }

    // NEW: API endpoint to fetch a specific task's history
    @GetMapping("/{id}/logs")
    public List<TaskLog> getTaskLogs(@PathVariable Long id) {
        return taskLogRepository.findByTaskIdOrderByTimestampDesc(id);
    }
    @GetMapping("/logs")
    public List<TaskLog> getAllLogs() {
        return taskLogRepository.findAllByOrderByTimestampDesc();
    }
}