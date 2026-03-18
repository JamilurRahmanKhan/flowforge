package com.flowforge.user.controller;

import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.user.dto.ChangePasswordRequest;
import com.flowforge.user.dto.CurrentUserResponse;
import com.flowforge.user.dto.UpdateProfileRequest;
import com.flowforge.user.dto.WorkspaceUserResponse;
import com.flowforge.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<WorkspaceUserResponse> getWorkspaceUsers(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return userService.getWorkspaceUsers(principal);
    }

    @GetMapping("/me")
    public CurrentUserResponse getCurrentUser(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return userService.getCurrentUser(principal);
    }

    @PutMapping("/me")
    public CurrentUserResponse updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        return userService.updateProfile(principal, request);
    }

    @PutMapping("/me/password")
    public void changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
        userService.changePassword(principal, request);
    }
}