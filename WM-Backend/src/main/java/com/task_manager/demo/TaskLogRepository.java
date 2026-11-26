package com.task_manager.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskLogRepository extends JpaRepository<TaskLog, Long> {
    List<TaskLog> findByUserIdOrderByTimestampDesc(Long userId);
    List<TaskLog> findByTaskIdOrderByTimestampDesc(Long taskId);
}