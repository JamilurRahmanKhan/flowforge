package com.flowforge.projectmember.controller;

import com.flowforge.projectmember.dto.ProjectMemberResponse;
import com.flowforge.projectmember.service.ProjectMemberService;
import com.flowforge.security.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects/{projectId}/members")
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    @GetMapping
    public List<ProjectMemberResponse> getAssignedMembers(
            @PathVariable UUID projectId,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return projectMemberService.getAssignedMembers(projectId, principal);
    }

    @GetMapping("/available")
    public List<ProjectMemberResponse> getAvailableMembers(
            @PathVariable UUID projectId,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return projectMemberService.getAvailableMembers(projectId, principal);
    }

    @PostMapping("/{userId}")
    public void assignMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        projectMemberService.assignMember(projectId, userId, principal);
    }

    @DeleteMapping("/{userId}")
    public void removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        projectMemberService.removeMember(projectId, userId, principal);
    }
}