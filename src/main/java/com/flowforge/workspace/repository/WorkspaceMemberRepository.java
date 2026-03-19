package com.flowforge.workspace.repository;

import com.flowforge.workspace.entity.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, UUID> {

    List<WorkspaceMember> findByTenantIdOrderByCreatedAtDesc(UUID tenantId);

    List<WorkspaceMember> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<WorkspaceMember> findByTenantIdAndUserId(UUID tenantId, UUID userId);

    boolean existsByTenantIdAndUserId(UUID tenantId, UUID userId);

    long countByTenantId(UUID tenantId);
}