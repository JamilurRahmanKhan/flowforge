package com.flowforge.auth.controller;

import com.flowforge.auth.dto.LoginRequest;
import com.flowforge.auth.dto.LoginResponse;
import com.flowforge.auth.dto.RegisterOrgRequest;
import com.flowforge.auth.dto.RegisterOrgResponse;
import com.flowforge.auth.dto.SwitchWorkspaceRequest;
import com.flowforge.auth.dto.SwitchWorkspaceResponse;
import com.flowforge.auth.service.AuthService;
import com.flowforge.security.CustomUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterOrgResponse register(@Valid @RequestBody RegisterOrgRequest request) {
        return authService.registerOrganization(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/switch-workspace")
    public SwitchWorkspaceResponse switchWorkspace(
            @Valid @RequestBody SwitchWorkspaceRequest request,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return authService.switchWorkspace(principal, request);
    }
}