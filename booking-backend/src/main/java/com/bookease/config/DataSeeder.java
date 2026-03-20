package com.bookease.config;

import com.bookease.entity.Service;
import com.bookease.entity.User;
import com.bookease.entity.User.Role;
import com.bookease.repository.ServiceRepository;
import com.bookease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedServices();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@bookease.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@bookease.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin user created: admin@bookease.com / admin123");
        }
    }

    private void seedServices() {
        if (serviceRepository.count() == 0) {
            List<Service> services = List.of(
                Service.builder().name("Doctor Consultation")
                        .description("Book an appointment with a certified physician for health checkups or medical advice.")
                        .category("Healthcare").icon("🩺").duration("30 min").price("₹500").isActive(true).build(),

                Service.builder().name("Passport Assistance")
                        .description("Get help with passport applications, renewals, and document verification.")
                        .category("Government").icon("🛂").duration("45 min").price("₹200").isActive(true).build(),

                Service.builder().name("Salon Booking")
                        .description("Reserve a slot for haircut, styling, or grooming services at your preferred time.")
                        .category("Lifestyle").icon("✂️").duration("60 min").price("₹350").isActive(true).build(),

                Service.builder().name("Legal Consultation")
                        .description("Speak with a qualified lawyer about your legal concerns or documentation needs.")
                        .category("Legal").icon("⚖️").duration("45 min").price("₹800").isActive(true).build(),

                Service.builder().name("Tax Filing Help")
                        .description("File your income tax returns with expert assistance and avoid penalties.")
                        .category("Government").icon("🧾").duration("30 min").price("₹300").isActive(true).build(),

                Service.builder().name("Physiotherapy")
                        .description("Book a session with a licensed physiotherapist for pain relief and recovery.")
                        .category("Healthcare").icon("🦴").duration("60 min").price("₹600").isActive(true).build()
            );

            serviceRepository.saveAll(services);
            log.info("✅ {} default services seeded", services.size());
        }
    }
}
