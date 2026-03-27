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

        // Level 2: CATEGORY (Group 1) - with pricing
        Category group1 = categoryRepository.save(Category.builder()
                .name("Group 1 Services")
                .nameTe("గ్రూప్ 1 సర్వీసెస్")
                .description("Premium preparation for APPSC Group 1 services")
                .commissionId(appscId)
                .imageUrl("https://images.unsplash.com/photo-1521737604893-d14cc237f11d")
                .priceInr(1300.0)
                .prelimsPriceInr(700.0)
                .mainsPriceInr(900.0)
                .build());

        // Level 3: SUBCATEGORY (Subjects with Phase)
        SubCategory history = subCategoryRepository.save(SubCategory.builder()
                .name("History & Culture")
                .nameTe("చరిత్ర")
                .phase("PRELIMS")
                .category(group1)
                .build());

        SubCategory polity = subCategoryRepository.save(SubCategory.builder()
                .name("Constitution & Polity")
                .nameTe("రాజ్యాంగం")
                .phase("PRELIMS")
                .category(group1)
                .build());

        SubCategory paper2 = subCategoryRepository.save(SubCategory.builder()
                .name("Paper II: History, Culture and Geography")
                .nameTe("పేపర్ II")
                .phase("MAINS")
                .category(group1)
                .build());

        // Level 4: SECTION (Blueprint Sections)
        Section ancientIndia = sectionRepository.save(Section.builder()
                .name("Ancient India")
                .nameTe("ప్రాచీన భారతదేశం")
                .sectionCode("HIST-ANC")
                .subCategory(history)
                .build());
                
        Section modernIndia = sectionRepository.save(Section.builder()
                .name("Modern India")
                .nameTe("ఆధునిక భారతదేశం")
                .sectionCode("HIST-MOD")
                .subCategory(history)
                .build());

        // Level 5: TOPIC (Chapters)
        topicRepository.save(Topic.builder().name("Pre-Historic Cultures in India").nameTe("చరిత్ర").topicCode("PRE-HIST").section(ancientIndia).displayOrder(1).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Indus Valley Civilization").nameTe("సింధు నది").topicCode("H1-02").section(ancientIndia).displayOrder(2).isPublished(true).build());
        topicRepository.save(Topic.builder().name("Vedic Society").nameTe("వేద సమాజం").topicCode("H1-03").section(ancientIndia).displayOrder(3).isPublished(true).build());

        System.out.println("✅ Seeded APPSC -> Group 1 -> Prelims/Mains hierarchical standard structure.");
    }
}
