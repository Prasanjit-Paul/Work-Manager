package com.task_manager.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskLogRepository taskLogRepository;

    @GetMapping
    public List<Task> getTasks(@RequestParam Long userId) {
        return taskRepository.findByUserId(userId);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Task saved = taskRepository.save(task);
        String logMessage = "Created in " + saved.getStage();
        taskLogRepository.save(new TaskLog(saved.getId(), saved.getUserId(), logMessage));
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task updated) {
        return taskRepository.findById(id).map(existing -> {
            if (existing.getUserId() != null && !existing.getUserId().equals(updated.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            String oldStage = existing.getStage();

            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setImportance(updated.getImportance());
            existing.setStage(updated.getStage());
            if (existing.getUserId() == null) {
                existing.setUserId(updated.getUserId());
            }

            Task saved = taskRepository.save(existing);

            if (oldStage != null && !oldStage.equals(saved.getStage())) {
                String logMessage = "Moved from " + oldStage + " to " + saved.getStage();
                taskLogRepository.save(new TaskLog(saved.getId(), saved.getUserId(), logMessage));
            }

            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @RequestParam Long userId) {
        return taskRepository.findById(id).map(existing -> {
            if (existing.getUserId() != null && !existing.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            taskRepository.delete(existing);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/logs")
    public List<TaskLog> getAllLogs(@RequestParam Long userId) {
        return taskLogRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<?> getTaskLogs(@PathVariable Long id, @RequestParam Long userId) {
        return taskRepository.findById(id).map(existing -> {
            if (existing.getUserId() != null && !existing.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            return ResponseEntity.ok(taskLogRepository.findByTaskIdOrderByTimestampDesc(id));
        }).orElse(ResponseEntity.notFound().build());
    }
}