package com.bookease.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {

    private Long id;
    private String name;
    private String description;
    private String category;
    private String icon;
    private String duration;
    private String price;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
