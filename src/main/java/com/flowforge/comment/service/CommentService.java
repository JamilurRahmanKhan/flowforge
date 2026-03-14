package com.flowforge.comment.service;
import com.flowforge.task.repository.TaskRepository;

import com.flowforge.comment.dto.CommentResponse;
import com.flowforge.comment.dto.CreateCommentRequest;
import com.flowforge.comment.entity.Comment;
import com.flowforge.comment.repository.CommentRepository;
import com.flowforge.common.exception.BadRequestException;
import com.flowforge.security.CustomUserPrincipal;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;

    public CommentService(CommentRepository commentRepository, TaskRepository taskRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
    }

    public CommentResponse createComment(CreateCommentRequest request, CustomUserPrincipal principal) {
        taskRepository.findByIdAndTenantId(request.getTaskId(), principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found in this workspace"));

        Comment comment = Comment.builder()
                .tenantId(principal.getTenantId())
                .taskId(request.getTaskId())
                .authorId(principal.getUserId())
                .content(request.getContent().trim())
                .createdAt(Instant.now())
                .build();

        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    public List<CommentResponse> getCommentsByTask(UUID taskId, CustomUserPrincipal principal) {
        taskRepository.findByIdAndTenantId(taskId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Task not found in this workspace"));

        return commentRepository.findByTenantIdAndTaskIdOrderByCreatedAtAsc(principal.getTenantId(), taskId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getTenantId(),
                comment.getTaskId(),
                comment.getAuthorId(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}