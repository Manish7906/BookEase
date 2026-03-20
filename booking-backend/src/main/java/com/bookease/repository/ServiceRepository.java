package com.bookease.repository;

import com.bookease.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByIsActiveTrue();
    List<Service> findByCategoryIgnoreCase(String category);
    List<Service> findByIsActiveTrueOrderByCreatedAtDesc();
}
