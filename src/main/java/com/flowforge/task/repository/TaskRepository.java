package com.flowforge.task.repository;

import com.flowforge.task.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByTenantIdAndProjectIdOrderByCreatedAtDesc(UUID tenantId, UUID projectId);
    Optional<Task> findByIdAndTenantId(UUID id, UUID tenantId);
}