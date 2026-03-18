package com.flowforge.activity.controller;

import com.flowforge.activity.dto.ActivityResponse;
import com.flowforge.activity.service.ActivityService;
import com.flowforge.security.CustomUserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<ActivityResponse> getWorkspaceActivity(
            Authentication authentication,
            @RequestParam(defaultValue = "30") int limit
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return activityService.getWorkspaceActivity(principal, limit);
    }

    @GetMapping("/projects/{projectId}")
    public List<ActivityResponse> getProjectActivity(
            @PathVariable UUID projectId,
            Authentication authentication,
            @RequestParam(defaultValue = "20") int limit
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return activityService.getProjectActivity(projectId, principal, limit);
    }

    @GetMapping("/recent")
    public List<ActivityResponse> getRecentActivity(
            Authentication authentication,
            @RequestParam(defaultValue = "8") int limit
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return activityService.getWorkspaceActivity(principal, limit);
    }
}