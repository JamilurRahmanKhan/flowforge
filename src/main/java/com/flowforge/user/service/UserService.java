package com.flowforge.user.service;

import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.user.dto.UserResponse;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getWorkspaceUsers(CustomUserPrincipal principal) {
        return userRepository.findAllByTenantIdOrderByCreatedAtDesc(principal.getTenantId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .tenantId(user.getTenantId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}