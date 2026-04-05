package com.finance.config;

import com.finance.model.Role;
import com.finance.model.User;
import com.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Override
    public void run(String... args) {
        if (!seedEnabled) return;

        if (!userRepository.existsByEmail("admin@gmail.com")) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setIsActive(true);
            userRepository.save(admin);
            System.out.println("Seeded: admin@gmail.com");
        }

        if (!userRepository.existsByEmail("analyst@gmail.com")) {
            User analyst = new User();
            analyst.setName("Analyst");
            analyst.setEmail("analyst@gmail.com");
            analyst.setPassword(passwordEncoder.encode("analyst123"));
            analyst.setRole(Role.ANALYST);
            analyst.setIsActive(true);
            userRepository.save(analyst);
            System.out.println("Seeded: analyst@gmail.com");
        }
    }
}