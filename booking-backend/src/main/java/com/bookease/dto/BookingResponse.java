package com.bookease.dto;

import com.bookease.entity.Booking.BookingStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long serviceId;
    private String serviceName;
    private String serviceIcon;
    private String serviceCategory;
    private LocalDate bookingDate;
    private BookingStatus status;
    private String notes;
    private LocalDateTime createdAt;
}
