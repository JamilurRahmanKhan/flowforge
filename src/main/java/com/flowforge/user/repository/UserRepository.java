package com.flowforge.user.repository;

import com.flowforge.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByTenantIdAndEmail(UUID tenantId, String email);
    Optional<User> findByIdAndTenantId(UUID id, UUID tenantId);
    List<User> findAllByTenantIdOrderByCreatedAtDesc(UUID tenantId);
}