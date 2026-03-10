package com.flowforge.auth.service;

import com.flowforge.auth.dto.LoginRequest;
import com.flowforge.auth.dto.LoginResponse;
import com.flowforge.auth.dto.RegisterOrgRequest;
import com.flowforge.auth.dto.RegisterOrgResponse;
import com.flowforge.common.exception.BadRequestException;
import com.flowforge.organization.entity.Organization;
import com.flowforge.organization.repository.OrganizationRepository;
import com.flowforge.security.jwt.JwtService;
import com.flowforge.user.entity.Role;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(OrganizationRepository organizationRepository,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterOrgResponse registerOrganization(RegisterOrgRequest request) {
        String normalizedSlug = request.getSlug().trim().toLowerCase();
        String normalizedEmail = request.getOwnerEmail().trim().toLowerCase();

        if (organizationRepository.existsBySlug(normalizedSlug)) {
            throw new BadRequestException("Organization slug already exists");
        }

        Organization organization = Organization.builder()
                .name(request.getOrganizationName().trim())
                .slug(normalizedSlug)
                .createdAt(Instant.now())
                .build();

        organization = organizationRepository.save(organization);

        User owner = User.builder()
                .tenantId(organization.getId())
                .name(request.getOwnerName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.ORG_OWNER)
                .active(true)
                .createdAt(Instant.now())
                .build();

        owner = userRepository.save(owner);

        return new RegisterOrgResponse(
                organization.getId(),
                organization.getName(),
                organization.getSlug(),
                owner.getId(),
                owner.getEmail(),
                "Organization registered successfully"
        );
    }

    public LoginResponse login(LoginRequest request) {
        String normalizedSlug = request.getSlug().trim().toLowerCase();
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Organization organization = organizationRepository.findBySlug(normalizedSlug)
                .orElseThrow(() -> new BadRequestException("Invalid workspace slug"));

        User user = userRepository.findByTenantIdAndEmail(organization.getId(), normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BadRequestException("User account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        String accessToken = jwtService.generateAccessToken(user);

        return new LoginResponse(
                accessToken,
                "Bearer",
                user.getId(),
                user.getTenantId(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}