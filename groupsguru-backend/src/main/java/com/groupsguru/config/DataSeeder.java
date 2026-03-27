package com.groupsguru.config;

import com.groupsguru.category.Category;
import com.groupsguru.category.CategoryRepository;
import com.groupsguru.commission.Commission;
import com.groupsguru.commission.CommissionRepository;
import com.groupsguru.section.Section;
import com.groupsguru.section.SectionRepository;
import com.groupsguru.subcategory.SubCategory;
import com.groupsguru.subcategory.SubCategoryRepository;
import com.groupsguru.topic.Topic;
import com.groupsguru.topic.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
@RequiredArgsConstructor
@Order(2)
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final CommissionRepository commissionRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final SectionRepository sectionRepository;
    private final TopicRepository topicRepository;

    @Override
    public void run(String... args) throws Exception {
        topicRepository.deleteAll();
        sectionRepository.deleteAll();
        subCategoryRepository.deleteAll();
        categoryRepository.deleteAll();


        // Get APPSC commission
        Commission appscComm = commissionRepository.findAll().stream()
                .filter(c -> "APPSC".equals(c.getCode()))
                .findFirst().orElse(null);
        Long appscId = appscComm != null ? appscComm.getId() : null;

        // Level 1: CATEGORY (APPSC)
        Category appsc = categoryRepository.save(Category.builder()
                .name("APPSC")
                .nameTe("ఆంధ్రప్రదేశ్ పబ్లిక్ సర్వీస్ కమిషన్")
                .description("Andhra Pradesh Public Service Commission Exams")
                .commissionId(appscId)
                .imageUrl("https://images.unsplash.com/photo-1521737604893-d14cc237f11d")
                .build());

        // Level 2: SUBCATEGORY (Group 1)
        SubCategory group1 = subCategoryRepository.save(SubCategory.builder()
                .name("Group 1 Services")
                .nameTe("గ్రూప్ 1 సర్వీసెస్")
                .description("Premium preparation for APPSC Group 1 services")
                .category(appsc)
                .build());

        // Level 3: SECTION (Prelims)
        Section prelims = sectionRepository.save(Section.builder()
                .name("Prelims (Screening Test)")
                .nameTe("ప్రిలిమ్స్ (స్క్రీనింగ్ టెస్ట్)")
                .sectionCode("G1-PRE")
                .subCategory(group1)
                .build());

        // Level 3: SECTION (Mains)
        Section mains = sectionRepository.save(Section.builder()
                .name("Mains (Written Exam)")
                .nameTe("మెయిన్స్ (రాత పరీక్ష)")
                .sectionCode("G1-MAINS")
                .subCategory(group1)
                .build());

        // Level 4: TOPIC (History & Culture - Prelims)
        topicRepository.save(Topic.builder().name("History & Culture").nameTe("చరిత్ర").topicCode("PRE-HIST").section(prelims).displayOrder(1).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Constitution & Polity").nameTe("రాజ్యాంగం").topicCode("PRE-POL").section(prelims).displayOrder(2).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Indian & AP Economy").nameTe("ఆర్థిక వ్యవస్థ").topicCode("PRE-ECO").section(prelims).displayOrder(3).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Geography").nameTe("భూగోళశాస్త్రం").topicCode("PRE-GEO").section(prelims).displayOrder(4).isPublished(true).build());

        // Level 4: TOPIC (Mains Papers)
        topicRepository.save(Topic.builder().name("Paper I: General Essay").nameTe("పేపర్ I").topicCode("MAIN-P1").section(mains).displayOrder(1).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Paper II: History, Culture and Geography").nameTe("పేపర్ II").topicCode("MAIN-P2").section(mains).displayOrder(2).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Paper III: Polity, Constitution, Governance").nameTe("పేపర్ III").topicCode("MAIN-P3").section(mains).displayOrder(3).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Paper IV: Economy and Development").nameTe("పేపర్ IV").topicCode("MAIN-P4").section(mains).displayOrder(4).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Paper V: Science, Technology").nameTe("పేపర్ V").topicCode("MAIN-P5").section(mains).displayOrder(5).isPublished(true).build());

        System.out.println("✅ Seeded APPSC -> Group 1 -> Prelims/Mains hierarchical standard structure.");
    }
}
