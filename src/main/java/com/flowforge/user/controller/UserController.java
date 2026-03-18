package com.flowforge.user.controller;

import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.user.dto.WorkspaceUserResponse;
import com.flowforge.user.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}