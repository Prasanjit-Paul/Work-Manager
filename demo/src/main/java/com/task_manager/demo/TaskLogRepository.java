package com.task_manager.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskLogRepository extends JpaRepository<TaskLog, Long> {
    List<TaskLog> findByTaskIdOrderByTimestampDesc(Long taskId);
    List<TaskLog> findAllByOrderByTimestampDesc();
}