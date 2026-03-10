package com.flowforge.user.controller;

import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.user.dto.CurrentUserResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public CurrentUserResponse getCurrentUser(Authentication authentication) {
        CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();

        return new CurrentUserResponse(
                principal.getUserId(),
                principal.getTenantId(),
                principal.getEmail(),
                principal.getRole()
        );
    }
}