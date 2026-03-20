package com.bookease.controller;

import com.bookease.dto.ApiResponse;
import com.bookease.dto.ServiceRequest;
import com.bookease.dto.ServiceResponse;
import com.bookease.service.ServiceManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceManagementService serviceManagementService;

    // ─── Public Endpoints ──────────────────────────────────────────────────────

    /**
     * GET /api/services
     * Get all active services (public)
     */
    @GetMapping("/api/services")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getAllServices() {
        return ResponseEntity.ok(ApiResponse.ok("Services fetched", serviceManagementService.getAllActiveServices()));
    }

    /**
     * GET /api/services/{id}
     * Get a specific service (public)
     */
    @GetMapping("/api/services/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> getService(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Service found", serviceManagementService.getServiceById(id)));
    }

    // ─── Admin Endpoints ───────────────────────────────────────────────────────

    /**
     * GET /api/admin/services
     * Get ALL services including inactive (admin only)
     */
    @GetMapping("/api/admin/services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getAllServicesAdmin() {
        return ResponseEntity.ok(ApiResponse.ok("All services fetched", serviceManagementService.getAllServices()));
    }

    /**
     * POST /api/admin/services
     * Create a new service (admin only)
     */
    @PostMapping("/api/admin/services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServiceResponse>> createService(@Valid @RequestBody ServiceRequest request) {
        ServiceResponse created = serviceManagementService.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Service created", created));
    }

    /**
     * PUT /api/admin/services/{id}
     * Update a service (admin only)
     */
    @PutMapping("/api/admin/services/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Service updated", serviceManagementService.updateService(id, request)));
    }

    /**
     * DELETE /api/admin/services/{id}
     * Soft delete a service (admin only)
     */
    @DeleteMapping("/api/admin/services/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable Long id) {
        serviceManagementService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.ok("Service deactivated"));
    }
}
