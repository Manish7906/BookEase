package com.bookease.service;

import com.bookease.dto.ServiceRequest;
import com.bookease.dto.ServiceResponse;
import com.bookease.entity.Service;
import com.bookease.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceManagementService {

    private final ServiceRepository serviceRepository;

    // ─── Public ────────────────────────────────────────────────────────────────

    public List<ServiceResponse> getAllActiveServices() {
        return serviceRepository.findByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ServiceResponse getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        return toResponse(service);
    }

    // ─── Admin ─────────────────────────────────────────────────────────────────

    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ServiceResponse createService(ServiceRequest request) {
        Service service = Service.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .icon(request.getIcon())
                .duration(request.getDuration())
                .price(request.getPrice())
                .isActive(true)
                .build();

        return toResponse(serviceRepository.save(service));
    }

    public ServiceResponse updateService(Long id, ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setIcon(request.getIcon());
        service.setDuration(request.getDuration());
        service.setPrice(request.getPrice());

        return toResponse(serviceRepository.save(service));
    }

    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        // Soft delete
        service.setIsActive(false);
        serviceRepository.save(service);
    }

    // ─── Mapper ────────────────────────────────────────────────────────────────

    private ServiceResponse toResponse(Service service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .category(service.getCategory())
                .icon(service.getIcon())
                .duration(service.getDuration())
                .price(service.getPrice())
                .isActive(service.getIsActive())
                .createdAt(service.getCreatedAt())
                .build();
    }
}
