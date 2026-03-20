package com.bookease.controller;

import com.bookease.dto.ApiResponse;
import com.bookease.dto.BookingRequest;
import com.bookease.dto.BookingResponse;
import com.bookease.dto.BookingStatusUpdateRequest;
import com.bookease.service.BookingService;
import com.bookease.service.BookingService.BookingStats;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // ─── User Endpoints ────────────────────────────────────────────────────────

    /**
     * POST /api/bookings
     * Create a new booking (authenticated user)
     */
    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        BookingResponse booking = bookingService.createBooking(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking created successfully", booking));
    }

    /**
     * GET /api/bookings/my
     * Get current user's bookings
     */
    @GetMapping("/bookings/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<BookingResponse> bookings = bookingService.getMyBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Bookings fetched", bookings));
    }

    /**
     * GET /api/bookings/{id}
     * Get a specific booking (owner only)
     */
    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        BookingResponse booking = bookingService.getBookingById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Booking found", booking));
    }

    /**
     * PATCH /api/bookings/{id}/cancel
     * Cancel a booking (owner only)
     */
    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        bookingService.cancelBooking(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled"));
    }

    // ─── Admin Endpoints ───────────────────────────────────────────────────────

    /**
     * GET /api/admin/bookings
     * Get all bookings (admin only)
     */
    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.ok("All bookings", bookingService.getAllBookings()));
    }

    /**
     * PATCH /api/admin/bookings/{id}/status
     * Update booking status (admin only)
     */
    @PatchMapping("/admin/bookings/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {

        BookingResponse updated = bookingService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Status updated", updated));
    }

    /**
     * GET /api/admin/bookings/stats
     * Get booking statistics (admin only)
     */
    @GetMapping("/admin/bookings/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingStats>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok("Stats", bookingService.getStats()));
    }
}
