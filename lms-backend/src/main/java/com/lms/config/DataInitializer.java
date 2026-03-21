package com.lms.config;

import com.lms.auth.Role;
import com.lms.auth.User;
import com.lms.auth.UserRepository;
import com.lms.commission.Commission;
import com.lms.commission.CommissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CommissionRepository commissionRepository;

    @Override
    public void run(String... args) {

        String adminEmail = "admin@lms.com";
        String adminPassword = "Admin@123";

        if (!userRepository.existsByEmail(adminEmail)) {

            User admin = User.builder()
                    .name("System Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
            System.out.println("Default ADMIN user created");
        }

        String studentEmail = "student@lms.com";
        String studentPassword = "Student@123";

        if (!userRepository.existsByEmail(studentEmail)) {
            User student = User.builder()
                    .name("Jayram (Student)")
                    .email(studentEmail)
                    .password(passwordEncoder.encode(studentPassword))
                    .role(Role.STUDENT)
                    .build();

            userRepository.save(student);
            System.out.println("Default STUDENT user created for Jayram.");
        }

        if (!commissionRepository.existsByCode("APPSC")) {
            commissionRepository.save(Commission.builder().code("APPSC").name("APPSC").nameTe("APPSC (Telugu)").displayOrder(1).build());
            System.out.println("Commission APPSC seeded");
        }
        if (!commissionRepository.existsByCode("TSPSC")) {
            commissionRepository.save(Commission.builder().code("TSPSC").name("TSPSC").nameTe("TSPSC (Telugu)").displayOrder(2).build());
            System.out.println("Commission TSPSC seeded");
        }
        if (!commissionRepository.existsByCode("UPSC")) {
            commissionRepository.save(Commission.builder().code("UPSC").name("UPSC").nameTe("UPSC (Telugu)").displayOrder(3).build());
            System.out.println("Commission UPSC seeded");
        }
    }
}
