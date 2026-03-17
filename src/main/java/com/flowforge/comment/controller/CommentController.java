package com.flowforge.comment.controller;

import com.flowforge.comment.dto.CommentResponse;
import com.flowforge.comment.dto.CreateCommentRequest;
import com.flowforge.comment.service.CommentService;
import com.flowforge.security.CustomUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<CommentResponse> getCommentsByTask(
            @RequestParam UUID taskId,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return commentService.getCommentsByTask(taskId, principal);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse createComment(
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return commentService.createComment(request, principal);
    }
}