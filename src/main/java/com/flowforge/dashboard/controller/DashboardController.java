package com.flowforge.dashboard.controller;

import com.flowforge.dashboard.dto.DashboardSummaryResponse;
import com.flowforge.dashboard.service.DashboardService;
import com.flowforge.security.CustomUserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public DashboardSummaryResponse getDashboard(Authentication authentication) {
        CustomUserPrincipal principal =
                (CustomUserPrincipal) authentication.getPrincipal();

        return dashboardService.getDashboard(principal);
    }
}