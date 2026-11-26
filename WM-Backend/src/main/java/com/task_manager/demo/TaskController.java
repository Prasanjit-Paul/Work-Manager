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
    private TaskLogRepository taskLogRepository; // NEW: Inject the log repository

//    @GetMapping
//    public List<Task> getAllTasks() {
//        return taskRepository.findAll();
//    }
//
//    @PostMapping
//    public Task createTask(@RequestBody Task task) {
//        return taskRepository.save(task);
//    }
//
//    @PutMapping("/{id}")
//    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
//        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
//
//        // NEW: Check if the stage has changed at all, no matter which column it comes from
//        if (!task.getStage().equals(taskDetails.getStage())) {
//            String logMessage = "Moved from " + task.getStage() + " to " + taskDetails.getStage();
//            taskLogRepository.save(new TaskLog(id, logMessage));
//        }
//
//        task.setTitle(taskDetails.getTitle());
//        task.setDescription(taskDetails.getDescription());
//        task.setStage(taskDetails.getStage());
//        task.setImportance(taskDetails.getImportance());
//
//        return taskRepository.save(task);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteTask(@PathVariable Long id) {
//        taskRepository.deleteById(id);
//    }
//
//    // NEW: API endpoint to fetch a specific task's history
//    @GetMapping("/{id}/logs")
//    public List<TaskLog> getTaskLogs(@PathVariable Long id) {
//        return taskLogRepository.findByTaskIdOrderByTimestampDesc(id);
//    }
//    @GetMapping("/logs")
//    public List<TaskLog> getAllLogs() {
//        return taskLogRepository.findAllByOrderByTimestampDesc();
//    }
// 1. Fetch only the logged-in user's tasks
@GetMapping
public List<Task> getTasks(@RequestParam Long userId) {
    return taskRepository.findByUserId(userId);
}

    // 2. Save new task with userId (sent inside the JSON body)
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Task saved = taskRepository.save(task);
        // IMPORTANT: Wherever you create your initial TaskLog here (or in your service),
        // also attach the userId:
        // log.setUserId(saved.getUserId());
        return saved;
    }

    // 3. Update task stage/fields only if it belongs to userId
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task updated) {
        return taskRepository.findById(id).map(existing -> {
            if (existing.getUserId() != null && !existing.getUserId().equals(updated.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            existing.setTitle(updated.getTitle());
            existing.setDescription(updated.getDescription());
            existing.setImportance(updated.getImportance());
            existing.setStage(updated.getStage());
            if (existing.getUserId() == null) {
                existing.setUserId(updated.getUserId());
            }
            Task saved = taskRepository.save(existing);
            // IMPORTANT: Wherever you save the stage-change TaskLog here (or in your service),
            // also attach the userId:
            // log.setUserId(saved.getUserId());
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Delete task only if it belongs to userId
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

    // 5. Fetch only the logged-in user's logs for the Reports tab
    @GetMapping("/logs")
    public List<TaskLog> getAllLogs(@RequestParam Long userId) {
        return taskLogRepository.findByUserId(userId);
    }

    // 6. Fetch single-task history only if the task belongs to userId
    @GetMapping("/{id}/logs")
    public ResponseEntity<?> getTaskLogs(@PathVariable Long id, @RequestParam Long userId) {
        return taskRepository.findById(id).map(existing -> {
            if (existing.getUserId() != null && !existing.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }
            return ResponseEntity.ok(taskLogRepository.findByTaskId(id));
        }).orElse(ResponseEntity.notFound().build());
    }


}