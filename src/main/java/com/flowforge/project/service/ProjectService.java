package com.flowforge.project.service;

import com.flowforge.common.exception.BadRequestException;
import com.flowforge.project.dto.CreateProjectRequest;
import com.flowforge.project.dto.ProjectResponse;
import com.flowforge.project.dto.UpdateProjectRequest;
import com.flowforge.project.entity.Project;
import com.flowforge.project.repository.ProjectRepository;
import com.flowforge.security.CustomUserPrincipal;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public ProjectResponse createProject(CreateProjectRequest request, CustomUserPrincipal principal) {
        String normalizedKey = request.getKey().trim().toUpperCase(Locale.ROOT);

        if (projectRepository.existsByTenantIdAndKey(principal.getTenantId(), normalizedKey)) {
            throw new BadRequestException("Project key already exists in this workspace");
        }

        Project project = Project.builder()
                .tenantId(principal.getTenantId())
                .name(request.getName().trim())
                .key(normalizedKey)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .status("ACTIVE")
                .createdBy(principal.getUserId())
                .createdAt(Instant.now())
                .build();

        project = projectRepository.save(project);

        return toResponse(project);
    }

    public List<ProjectResponse> getProjects(CustomUserPrincipal principal) {
        return projectRepository.findByTenantIdOrderByCreatedAtDesc(principal.getTenantId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getProjectById(UUID projectId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        return toResponse(project);
    }

    public ProjectResponse updateProject(UUID projectId, UpdateProjectRequest request, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        project.setName(request.getName().trim());
        project.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            project.setStatus(request.getStatus().trim().toUpperCase(Locale.ROOT));
        }

        project = projectRepository.save(project);
        return toResponse(project);
    }

    public ProjectResponse archiveProject(UUID projectId, CustomUserPrincipal principal) {
        Project project = projectRepository.findByIdAndTenantId(projectId, principal.getTenantId())
                .orElseThrow(() -> new BadRequestException("Project not found in this workspace"));

        project.setStatus("ARCHIVED");
        project = projectRepository.save(project);

        return toResponse(project);
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getTenantId(),
                project.getName(),
                project.getKey(),
                project.getDescription(),
                project.getStatus(),
                project.getCreatedBy(),
                project.getCreatedAt()
        );
    }
}