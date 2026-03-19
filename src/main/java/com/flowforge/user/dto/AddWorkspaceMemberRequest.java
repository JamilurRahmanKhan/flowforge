package com.flowforge.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AddWorkspaceMemberRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String role;

    public AddWorkspaceMemberRequest() {
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }
}