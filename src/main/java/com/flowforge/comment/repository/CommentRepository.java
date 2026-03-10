package com.flowforge.comment.repository;

import com.flowforge.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByTenantIdAndTaskIdOrderByCreatedAtAsc(UUID tenantId, UUID taskId);
}