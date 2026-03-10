package com.flowforge.auth.controller;

import com.flowforge.auth.dto.LoginRequest;
import com.flowforge.auth.dto.LoginResponse;
import com.flowforge.auth.dto.RegisterOrgRequest;
import com.flowforge.auth.dto.RegisterOrgResponse;
import com.flowforge.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register-org")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterOrgResponse registerOrganization(@Valid @RequestBody RegisterOrgRequest request) {
        return authService.registerOrganization(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}