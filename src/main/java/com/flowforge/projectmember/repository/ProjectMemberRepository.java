package com.flowforge.projectmember.repository;

import com.flowforge.projectmember.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {

    List<ProjectMember> findByTenantIdAndProjectIdOrderByCreatedAtAsc(UUID tenantId, UUID projectId);

    List<ProjectMember> findByTenantIdAndUserIdOrderByCreatedAtAsc(UUID tenantId, UUID userId);

    Optional<ProjectMember> findByTenantIdAndProjectIdAndUserId(UUID tenantId, UUID projectId, UUID userId);

    boolean existsByTenantIdAndProjectIdAndUserId(UUID tenantId, UUID projectId, UUID userId);

    long countByTenantIdAndUserId(UUID tenantId, UUID userId);

    long countByTenantIdAndProjectId(UUID tenantId, UUID projectId);
}