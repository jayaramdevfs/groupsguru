package com.groupsguru.config;

import com.groupsguru.auth.Role;
import com.groupsguru.auth.User;
import com.groupsguru.auth.UserRepository;
import com.groupsguru.commission.Commission;
import com.groupsguru.commission.CommissionRepository;
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
    private final com.groupsguru.migration.MaterialMigrationService materialMigrationService;

    @Override
    public void run(String... args) {

        String adminEmail = "admin@lms.com";
        String adminPassword = "Rama@1994";

        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .name("System Admin")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default ADMIN user created.");
        } else {
            // Log that admin exists but don't overwrite password
            System.out.println("Default ADMIN user verified.");
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

        System.out.println(">>> STARTING STUDY MATERIAL SYNC...");
        String syncResult = materialMigrationService.syncMaterialsFromDisk();
        System.out.println(">>> SYNC RESULT: " + syncResult);
    }
}
