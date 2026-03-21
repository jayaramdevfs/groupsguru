package com.groupsguru.config;

import com.groupsguru.category.Category;
import com.groupsguru.category.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            List<Category> categories = List.of(
                Category.builder()
                    .name("UPSC Civil Services")
                    .nameTe("UPSC సివిల్ సర్వీసెస్")
                    .description("Prepare for the IAS, IPS, and IFS elite examinations with our comprehensive modules.")
                    .descriptionTe("IAS, IPS మరియు IFS ఎలైట్ పరీక్షల కోసం మా సమగ్ర మాడ్యూల్స్‌తో సిద్ధం అవ్వండి.")
                    .imageUrl("https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=250&auto=format&fit=crop")
                    .isDeleted(false)
                    .build(),
                Category.builder()
                    .name("SSC CGL")
                    .nameTe("SSC CGL")
                    .description("Complete coverage for Staff Selection Commission Combined Graduate Level examination.")
                    .descriptionTe("స్టాఫ్ సెలక్షన్ కమిషన్ కంబైన్డ్ గ్రాడ్యుయేట్ లెవల్ పరీక్ష కోసం పూర్తి కవరేజ్.")
                    .imageUrl("https://images.unsplash.com/photo-1501503069356-3c6b82a17d89?q=80&w=250&auto=format&fit=crop")
                    .isDeleted(false)
                    .build(),
                Category.builder()
                    .name("Banking & IBPS")
                    .nameTe("బ్యాంకింగ్ & IBPS")
                    .description("Ace SBI PO, Clerk, and IBPS exams with our expert-curated mock tests.")
                    .descriptionTe("మా నిపుణులు క్యూరేట్ చేసిన మాక్ టెస్ట్‌లతో SBI PO, క్లర్క్ మరియు IBPS పరీక్షలలో విజయం సాధించండి.")
                    .imageUrl("https://images.unsplash.com/photo-1550565118-3d14336bf32c?q=80&w=250&auto=format&fit=crop")
                    .isDeleted(false)
                    .build(),
                Category.builder()
                    .name("APPSC Group 1")
                    .nameTe("APPSC గ్రూప్ 1")
                    .description("Premium preparation for APPSC Group 1 services including Prelims and Mains.")
                    .descriptionTe("ప్రిలిమ్స్ మరియు మెయిన్స్‌తో సహా APPSC గ్రూప్ 1 సేవల కోసం ప్రీమియం ప్రిపరేషన్.")
                    .imageUrl("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=250&auto=format&fit=crop")
                    .isDeleted(false)
                    .build(),
                Category.builder()
                    .name("APPSC Group 2")
                    .nameTe("APPSC గ్రూప్ 2")
                    .description("Comprehensive modules for Executive and Non-Executive Group 2 posts.")
                    .descriptionTe("ఎగ్జిక్యూటివ్ మరియు నాన్-ఎగ్జిక్యూటివ్ గ్రూప్ 2 పోస్ట్‌ల కోసం సమగ్ర మాడ్యూల్స్.")
                    .imageUrl("https://images.unsplash.com/photo-1454165833767-027ffea9e772?q=80&w=250&auto=format&fit=crop")
                    .isDeleted(false)
                    .build(),
                Category.builder()
                    .name("APPSC Group 3 & 4")
                    .nameTe("APPSC గ్రూప్ 3 & 4")
                    .description("Focused prep for Panchayat Secretary and Junior Assistant roles.")
                    .descriptionTe("పంచాయతీ కార్యదర్శి మరియు జూనియర్ అసిస్టెంట్ పాత్రల కోసం ఫోకస్డ్ ప్రిపరేషన్.")
                    .imageUrl("https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=250&auto=format&fit=crop")
                    .isDeleted(false)
                    .build()
            );
            categoryRepository.saveAll(categories);
            System.out.println("Seeded initial categories including APPSC Group 1-4.");
        }
    }
}
