package com.flowforge.common.exception;

import org.springframework.context.annotation.Bean;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }
}