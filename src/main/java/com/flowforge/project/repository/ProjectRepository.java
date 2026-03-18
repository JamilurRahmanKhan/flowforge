package com.flowforge.project.repository;

import com.flowforge.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);

    Optional<Project> findByIdAndTenantId(UUID id, UUID tenantId);

    boolean existsByTenantIdAndKey(UUID tenantId, String key);

    long countByTenantId(UUID tenantId);

    long countByTenantIdAndStatus(UUID tenantId, String status);
}