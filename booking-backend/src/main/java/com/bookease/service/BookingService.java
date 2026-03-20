package com.bookease.service;

import com.bookease.dto.BookingRequest;
import com.bookease.dto.BookingResponse;
import com.bookease.entity.Booking;
import com.bookease.entity.Booking.BookingStatus;
import com.bookease.entity.Service;
import com.bookease.entity.User;
import com.bookease.repository.BookingRepository;
import com.bookease.repository.ServiceRepository;
import com.bookease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    // ─── User operations ───────────────────────────────────────────────────────

    public BookingResponse createBooking(String userEmail, BookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + request.getServiceId()));

        if (!service.getIsActive()) {
            throw new RuntimeException("Service is not available");
        }

        Booking booking = Booking.builder()
                .user(user)
                .service(service)
                .bookingDate(request.getBookingDate())
                .notes(request.getNotes())
                .status(BookingStatus.PENDING)
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        // Ensure user can only see their own booking
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }

        return toResponse(booking);
    }

    public void cancelBooking(Long id, String userEmail) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel a completed booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    // ─── Admin operations ──────────────────────────────────────────────────────

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBookingStatus(Long id, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        booking.setStatus(newStatus);
        return toResponse(bookingRepository.save(booking));
    }

    public BookingStats getStats() {
        long total = bookingRepository.count();
        long confirmed = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long pending = bookingRepository.countByStatus(BookingStatus.PENDING);
        long cancelled = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        return new BookingStats(total, confirmed, pending, cancelled);
    }

    // ─── Mapper ────────────────────────────────────────────────────────────────

    private BookingResponse toResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .userId(b.getUser().getId())
                .userName(b.getUser().getName())
                .userEmail(b.getUser().getEmail())
                .serviceId(b.getService().getId())
                .serviceName(b.getService().getName())
                .serviceIcon(b.getService().getIcon())
                .serviceCategory(b.getService().getCategory())
                .bookingDate(b.getBookingDate())
                .status(b.getStatus())
                .notes(b.getNotes())
                .createdAt(b.getCreatedAt())
                .build();
    }

    // ─── Inner Stats class ─────────────────────────────────────────────────────

    public record BookingStats(long total, long confirmed, long pending, long cancelled) {}
}
