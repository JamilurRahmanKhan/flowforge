package com.flowforge.auth.service;

import com.flowforge.auth.dto.LoginRequest;
import com.flowforge.auth.dto.LoginResponse;
import com.flowforge.auth.dto.RegisterOrgRequest;
import com.flowforge.auth.dto.RegisterOrgResponse;
import com.flowforge.auth.dto.SwitchWorkspaceRequest;
import com.flowforge.auth.dto.SwitchWorkspaceResponse;
import com.flowforge.common.exception.BadRequestException;
import com.flowforge.organization.entity.Organization;
import com.flowforge.organization.repository.OrganizationRepository;
import com.flowforge.security.CustomUserPrincipal;
import com.flowforge.security.jwt.JwtService;
import com.flowforge.user.entity.User;
import com.flowforge.user.repository.UserRepository;
import com.flowforge.workspace.entity.WorkspaceMember;
import com.flowforge.workspace.repository.WorkspaceMemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            OrganizationRepository organizationRepository,
            UserRepository userRepository,
            WorkspaceMemberRepository workspaceMemberRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.workspaceMemberRepository = workspaceMemberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterOrgResponse registerOrganization(RegisterOrgRequest request) {
        String normalizedSlug = request.getSlug().trim().toLowerCase();
        String normalizedEmail = request.getOwnerEmail().trim().toLowerCase();

        if (organizationRepository.existsBySlug(normalizedSlug)) {
            throw new BadRequestException("Organization slug already exists");
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email already exists");
        }

        Organization organization = Organization.builder()
                .name(request.getOrganizationName().trim())
                .slug(normalizedSlug)
                .createdAt(Instant.now())
                .build();

        organization = organizationRepository.save(organization);

        User owner = User.builder()
                .name(request.getOwnerName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .active(true)
                .createdAt(Instant.now())
                .build();

        owner = userRepository.save(owner);

        WorkspaceMember ownerMembership = WorkspaceMember.builder()
                .tenantId(organization.getId())
                .userId(owner.getId())
                .role("ORG_OWNER")
                .addedBy(owner.getId())
                .createdAt(Instant.now())
                .build();

        workspaceMemberRepository.save(ownerMembership);

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

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        WorkspaceMember membership = workspaceMemberRepository
                .findByTenantIdAndUserId(organization.getId(), user.getId())
                .orElseThrow(() -> new BadRequestException("You are not a member of this workspace"));

        if (!user.isActive()) {
            throw new BadRequestException("User account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        String accessToken = jwtService.generateAccessToken(
                user.getId(),
                organization.getId(),
                user.getEmail(),
                membership.getRole()
        );

        return new LoginResponse(
                accessToken,
                "Bearer",
                user.getId(),
                organization.getId(),
                user.getEmail(),
                membership.getRole()
        );
    }

    public SwitchWorkspaceResponse switchWorkspace(
            CustomUserPrincipal principal,
            SwitchWorkspaceRequest request
    ) {
        String normalizedSlug = request.getWorkspaceSlug().trim().toLowerCase();

        Organization organization = organizationRepository.findBySlug(normalizedSlug)
                .orElseThrow(() -> new BadRequestException("Workspace not found"));

        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        WorkspaceMember membership = workspaceMemberRepository
                .findByTenantIdAndUserId(organization.getId(), user.getId())
                .orElseThrow(() -> new BadRequestException("You are not a member of this workspace"));

        if (!user.isActive()) {
            throw new BadRequestException("User account is inactive");
        }

        String accessToken = jwtService.generateAccessToken(
                user.getId(),
                organization.getId(),
                user.getEmail(),
                membership.getRole()
        );

        return new SwitchWorkspaceResponse(
                accessToken,
                "Bearer",
                user.getId(),
                organization.getId(),
                user.getEmail(),
                membership.getRole(),
                organization.getSlug(),
                organization.getName()
        );
    }
}