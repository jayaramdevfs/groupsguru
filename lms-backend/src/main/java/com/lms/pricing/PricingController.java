package com.lms.pricing;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.lms.commission.Commission;
import com.lms.commission.CommissionRepository;
import com.lms.category.Category;
import com.lms.category.CategoryRepository;
import com.lms.subcategory.SubCategory;
import com.lms.subcategory.SubCategoryRepository;
import com.lms.section.Section;
import com.lms.section.SectionRepository;
import com.lms.topic.Topic;
import com.lms.topic.TopicRepository;
import com.lms.registry.MicroTopic;
import com.lms.registry.MicroTopicRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/pricing")
@RequiredArgsConstructor
public class PricingController {

    private final CommissionRepository commissionRepo;
    private final CategoryRepository categoryRepo;
    private final SubCategoryRepository subCategoryRepo;
    private final SectionRepository sectionRepo;
    private final TopicRepository topicRepo;
    private final MicroTopicRepository microTopicRepo;

    @PutMapping("/{entityType}/{entityId}")
    public void updatePrice(@PathVariable String entityType, @PathVariable Long entityId, @RequestBody Map<String, Object> body) {
        Double price = body.get("priceInr") != null ? Double.valueOf(body.get("priceInr").toString()) : null;
        String accessType = (price != null && price > 0) ? "PAID" : "FREE";
        
        switch(entityType.toUpperCase()) {
            case "COMMISSION":
                Commission comm = commissionRepo.findById(entityId).orElseThrow();
                comm.setPriceInr(price);
                comm.setAccessType(accessType);
                commissionRepo.save(comm);
                break;
            case "CATEGORY":
                Category cat = categoryRepo.findById(entityId).orElseThrow();
                cat.setPriceInr(price);
                cat.setAccessType(accessType);
                categoryRepo.save(cat);
                break;
            case "SUB_CATEGORY":
                SubCategory sub = subCategoryRepo.findById(entityId).orElseThrow();
                sub.setPriceInr(price);
                sub.setAccessType(accessType);
                subCategoryRepo.save(sub);
                break;
            case "SECTION":
                Section sec = sectionRepo.findById(entityId).orElseThrow();
                sec.setPriceInr(price);
                sec.setAccessType(accessType);
                sectionRepo.save(sec);
                break;
            case "TOPIC":
                Topic top = topicRepo.findById(entityId).orElseThrow();
                top.setPriceInr(price);
                top.setAccessType(accessType);
                topicRepo.save(top);
                break;
            case "MICRO_TOPIC":
                MicroTopic mt = microTopicRepo.findById(entityId).orElseThrow();
                mt.setPriceInr(price);
                mt.setAccessType(accessType);
                microTopicRepo.save(mt);
                break;
            default:
                throw new IllegalArgumentException("Unknown entityType for pricing update");
        }
    }
}
