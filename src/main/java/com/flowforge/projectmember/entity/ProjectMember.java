package com.flowforge.projectmember.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "project_members")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMember {

    @Id
    private UUID id;

    private UUID tenantId;
    private UUID projectId;
    private UUID userId;
    private UUID addedBy;
    private Instant createdAt;
}