package com.task_manager.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // By extending JpaRepository, Spring Boot automatically gives you
    // methods like .findAll(), .save(), and .deleteById() for free.
    List<Task> findByUserId(Long userId);
}