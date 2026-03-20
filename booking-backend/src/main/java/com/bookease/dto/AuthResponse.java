package com.bookease.dto;

import com.bookease.entity.User.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;

    @Builder.Default
    private String type = "Bearer";

    private Long id;
    private String name;
    private String email;
    private Role role;
}
