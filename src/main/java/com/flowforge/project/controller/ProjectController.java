package com.flowforge.project.controller;

import com.flowforge.project.dto.CreateProjectRequest;
import com.flowforge.project.dto.ProjectResponse;
import com.flowforge.project.dto.UpdateProjectRequest;
import com.flowforge.project.service.ProjectService;
import com.flowforge.security.CustomUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(@Valid @RequestBody CreateProjectRequest request,
                                         Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return projectService.createProject(request, principal);
    }

    @GetMapping
    public List<ProjectResponse> getProjects(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return projectService.getProjects(principal);
    }

    @GetMapping("/{id}")
    public ProjectResponse getProjectById(@PathVariable UUID id, Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return projectService.getProjectById(id, principal);
    }

    @PutMapping("/{id}")
    public ProjectResponse updateProject(@PathVariable UUID id,
                                         @Valid @RequestBody UpdateProjectRequest request,
                                         Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return projectService.updateProject(id, request, principal);
    }

    @PatchMapping("/{id}/archive")
    public ProjectResponse archiveProject(@PathVariable UUID id, Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return projectService.archiveProject(id, principal);
    }

    @PatchMapping("/{id}/unarchive")
    public ProjectResponse unarchiveProject(@PathVariable UUID id,
                                            Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return projectService.unarchiveProject(id, principal);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable UUID id,
                              Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        projectService.deleteProject(id, principal);
    }
}