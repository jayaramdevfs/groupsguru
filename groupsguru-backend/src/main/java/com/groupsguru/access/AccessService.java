package com.groupsguru.access;

import com.groupsguru.commission.*;
import com.groupsguru.category.*;
import com.groupsguru.subcategory.*;
import com.groupsguru.section.*;
import com.groupsguru.topic.*;
import com.groupsguru.registry.*;
import com.groupsguru.payment.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccessService {
    private final CommissionRepository commissionRepo;
    private final CategoryRepository categoryRepo;
    private final SubCategoryRepository subCategoryRepo;
    private final SectionRepository sectionRepo;
    private final TopicRepository topicRepo;
    private final MicroTopicRepository microTopicRepo;
    private final PurchaseRepository purchaseRepository;

    public AccessCheckResponse checkAccess(Long userId, String entityType, Long entityId) {
        Double price = null;
        boolean isFree = false;
        String name = "";
        
        Long parentId = null;
        String parentType = null;
        
        switch(entityType.toUpperCase()) {
            case "COMMISSION":
                Commission comm = commissionRepo.findById(entityId).orElseThrow();
                price = comm.getPriceInr();
                isFree = "FREE".equals(comm.getAccessType()) || price == null || price == 0;
                name = comm.getName();
                break;
            case "CATEGORY":
                Category cat = categoryRepo.findById(entityId).orElseThrow();
                price = cat.getPriceInr();
                isFree = "FREE".equals(cat.getAccessType()) || price == null || price == 0;
                name = cat.getName();
                parentId = cat.getCommissionId();
                parentType = "COMMISSION";
                break;
            case "SUB_CATEGORY":
                SubCategory sub = subCategoryRepo.findById(entityId).orElseThrow();
                price = sub.getPriceInr();
                isFree = "FREE".equals(sub.getAccessType()) || price == null || price == 0;
                name = sub.getName();
                parentId = sub.getCategory().getId();
                parentType = "CATEGORY";
                break;
            case "SECTION":
                Section sec = sectionRepo.findById(entityId).orElseThrow();
                price = sec.getPriceInr();
                isFree = "FREE".equals(sec.getAccessType()) || price == null || price == 0;
                name = sec.getName();
                parentId = sec.getSubCategory().getId();
                parentType = "SUB_CATEGORY";
                break;
            case "TOPIC":
                Topic top = topicRepo.findById(entityId).orElseThrow();
                price = top.getPriceInr();
                isFree = "FREE".equals(top.getAccessType()) || price == null || price == 0;
                name = top.getName();
                parentId = top.getSection().getId();
                parentType = "SECTION";
                break;
            case "MICRO_TOPIC":
                MicroTopic mt = microTopicRepo.findById(entityId).orElseThrow();
                price = mt.getPriceInr();
                isFree = "FREE".equals(mt.getAccessType()) || price == null || price == 0;
                name = mt.getMicroTopicId(); 
                parentId = mt.getTopicId();
                if (parentId != null) {
                    parentType = "TOPIC";
                }
                break;
            default:
                throw new IllegalArgumentException("Unknown entity type");
        }

        if (isFree) {
            return AccessCheckResponse.builder().hasAccess(true).price(0.0).build();
        }

        // 2. Check purchases in DB
        boolean purchased = purchaseRepository.findByUserIdAndEntityTypeAndEntityIdAndStatus(userId, entityType, entityId, "SUCCESS").isPresent();
        
        // 3. Fallback: Check if any parent is purchased (recursive check not strictly needed if we check direct parents, but let's check one level up for now if needed, or rely on frontend to offer bundles)
        // Actually, the current logic is: if you buy a Category, you get all SubCategories.
        // So I should check if any parent is purchased.
        
        if (!purchased && parentType != null && parentId != null) {
            purchased = hasPurchasedParent(userId, parentType, parentId);
        }
        
        List<AccessCheckResponse.ParentOption> parentOptions = new ArrayList<>();
        gatherParents(parentType, parentId, parentOptions);
        
        return AccessCheckResponse.builder()
                .hasAccess(purchased)
                .price(price)
                .parentOptions(parentOptions)
                .build();
    }
    
    private void gatherParents(String type, Long id, List<AccessCheckResponse.ParentOption> options) {
        if (type == null || id == null) return;
        
        Long nextParentId = null;
        String nextParentType = null;
        
        switch (type) {
            case "COMMISSION":
                Commission comm = commissionRepo.findById(id).orElse(null);
                if (comm != null) {
                    addOption(options, type, id, comm.getName(), comm.getPriceInr());
                }
                break;
            case "CATEGORY":
                Category cat = categoryRepo.findById(id).orElse(null);
                if (cat != null) {
                    addOption(options, type, id, cat.getName(), cat.getPriceInr());
                    nextParentId = cat.getCommissionId();
                    nextParentType = "COMMISSION";
                }
                break;
            case "SUB_CATEGORY":
                SubCategory sub = subCategoryRepo.findById(id).orElse(null);
                if (sub != null) {
                    addOption(options, type, id, sub.getName(), sub.getPriceInr());
                    nextParentId = sub.getCategory().getId();
                    nextParentType = "CATEGORY";
                }
                break;
            case "SECTION":
                Section sec = sectionRepo.findById(id).orElse(null);
                if (sec != null) {
                    addOption(options, type, id, sec.getName(), sec.getPriceInr());
                    nextParentId = sec.getSubCategory().getId();
                    nextParentType = "SUB_CATEGORY";
                }
                break;
            case "TOPIC":
                Topic top = topicRepo.findById(id).orElse(null);
                if (top != null) {
                    addOption(options, type, id, top.getName(), top.getPriceInr());
                    nextParentId = top.getSection().getId();
                    nextParentType = "SECTION";
                }
                break;
        }
        
        if (nextParentType != null && nextParentId != null) {
            gatherParents(nextParentType, nextParentId, options);
        }
    }
    
    private void addOption(List<AccessCheckResponse.ParentOption> options, String type, Long id, String name, Double price) {
        if (price != null && price > 0) {
            options.add(AccessCheckResponse.ParentOption.builder()
                    .entityType(type)
                    .entityId(id)
                    .name(name)
                    .price(price)
                    .build());
        }
    }

    private boolean hasPurchasedParent(Long userId, String parentType, Long parentId) {
        boolean purchased = purchaseRepository.findByUserIdAndEntityTypeAndEntityIdAndStatus(userId, parentType, parentId, "SUCCESS").isPresent();
        if (purchased) return true;

        // Recursively check parents
        // Get parent's parent
        String nextParentType = null;
        Long nextParentId = null;

        switch (parentType) {
            case "CATEGORY":
                Category cat = categoryRepo.findById(parentId).orElse(null);
                if (cat != null) {
                    nextParentType = "COMMISSION";
                    nextParentId = cat.getCommissionId();
                }
                break;
            case "SUB_CATEGORY":
                SubCategory sub = subCategoryRepo.findById(parentId).orElse(null);
                if (sub != null) {
                    nextParentType = "CATEGORY";
                    nextParentId = sub.getCategory().getId();
                }
                break;
            case "SECTION":
                Section sec = sectionRepo.findById(parentId).orElse(null);
                if (sec != null) {
                    nextParentType = "SUB_CATEGORY";
                    nextParentId = sec.getSubCategory().getId();
                }
                break;
            case "TOPIC":
                Topic top = topicRepo.findById(parentId).orElse(null);
                if (top != null) {
                    nextParentType = "SECTION";
                    nextParentId = top.getSection().getId();
                }
                break;
        }

        if (nextParentType != null && nextParentId != null) {
            return hasPurchasedParent(userId, nextParentType, nextParentId);
        }

        return false;
    }
}
