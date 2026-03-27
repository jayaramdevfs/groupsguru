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
        String requiredPhase = null;
        
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
            case "SUBCATEGORY":
                SubCategory sub = subCategoryRepo.findById(entityId).orElseThrow();
                price = sub.getPriceInr();
                isFree = "FREE".equals(sub.getAccessType()) || price == null || price == 0;
                name = sub.getName();
                parentId = sub.getCategory().getId();
                parentType = "CATEGORY";
                requiredPhase = sub.getPhase();
                break;
            case "SECTION":
                Section sec = sectionRepo.findById(entityId).orElseThrow();
                price = sec.getPriceInr();
                isFree = "FREE".equals(sec.getAccessType()) || price == null || price == 0;
                name = sec.getName();
                parentId = sec.getSubCategory().getId();
                parentType = "SUB_CATEGORY";
                requiredPhase = sec.getSubCategory().getPhase();
                break;
            case "TOPIC":
                Topic top = topicRepo.findById(entityId).orElseThrow();
                price = top.getPriceInr();
                isFree = "FREE".equals(top.getAccessType()) || price == null || price == 0;
                name = top.getName();
                parentId = top.getSection().getId();
                parentType = "SECTION";
                requiredPhase = top.getSection().getSubCategory().getPhase();
                break;
            case "MICRO_TOPIC":
                MicroTopic mt = microTopicRepo.findById(entityId).orElseThrow();
                price = mt.getPriceInr();
                isFree = "FREE".equals(mt.getAccessType()) || price == null || price == 0;
                name = mt.getMicroTopicId(); 
                parentId = mt.getTopicId();
                if (parentId != null) {
                    parentType = "TOPIC";
                    Topic pTop = topicRepo.findById(parentId).orElse(null);
                    if (pTop != null) requiredPhase = pTop.getSection().getSubCategory().getPhase();
                }
                break;
            default:
                throw new IllegalArgumentException("Unknown entity type");
        }

        if (isFree) {
            return AccessCheckResponse.builder().hasAccess(true).price(0.0).build();
        }

        // 2. Check purchases in DB
        boolean purchased = false;
        List<com.groupsguru.payment.Purchase> directPurchases = purchaseRepository.findAllByUserIdAndEntityTypeAndEntityIdAndStatus(userId, entityType, entityId, "SUCCESS");
        for (com.groupsguru.payment.Purchase p : directPurchases) {
            String pt = p.getPackageType();
            if (pt == null || "COMPLETE".equals(pt) || "BOTH".equals(requiredPhase) || pt.equals(requiredPhase) || requiredPhase == null) {
                purchased = true;
                break;
            }
        }
        
        // 3. Fallback: Check if any parent is purchased
        if (!purchased && parentType != null && parentId != null) {
            purchased = hasPurchasedParent(userId, parentType, parentId, requiredPhase);
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
                    addOption(options, type, id, comm.getName(), comm.getPriceInr(), "COMPLETE");
                }
                break;
            case "CATEGORY":
                Category cat = categoryRepo.findById(id).orElse(null);
                if (cat != null) {
                    addOption(options, type, id, cat.getName() + " (Complete)", cat.getPriceInr(), "COMPLETE");
                    if (cat.getPrelimsPriceInr() != null && cat.getPrelimsPriceInr() > 0) {
                        addOption(options, type, id, cat.getName() + " (Prelims)", cat.getPrelimsPriceInr(), "PRELIMS");
                    }
                    if (cat.getMainsPriceInr() != null && cat.getMainsPriceInr() > 0) {
                        addOption(options, type, id, cat.getName() + " (Mains)", cat.getMainsPriceInr(), "MAINS");
                    }
                    nextParentId = cat.getCommissionId();
                    nextParentType = "COMMISSION";
                }
                break;
            case "SUB_CATEGORY":
                SubCategory sub = subCategoryRepo.findById(id).orElse(null);
                if (sub != null) {
                    addOption(options, type, id, sub.getName(), sub.getPriceInr(), "COMPLETE");
                    nextParentId = sub.getCategory().getId();
                    nextParentType = "CATEGORY";
                }
                break;
            case "SECTION":
                Section sec = sectionRepo.findById(id).orElse(null);
                if (sec != null) {
                    addOption(options, type, id, sec.getName(), sec.getPriceInr(), "COMPLETE");
                    nextParentId = sec.getSubCategory().getId();
                    nextParentType = "SUB_CATEGORY";
                }
                break;
            case "TOPIC":
                Topic top = topicRepo.findById(id).orElse(null);
                if (top != null) {
                    addOption(options, type, id, top.getName(), top.getPriceInr(), "COMPLETE");
                    nextParentId = top.getSection().getId();
                    nextParentType = "SECTION";
                }
                break;
        }
        
        if (nextParentType != null && nextParentId != null) {
            gatherParents(nextParentType, nextParentId, options);
        }
    }
    
    private void addOption(List<AccessCheckResponse.ParentOption> options, String type, Long id, String name, Double price, String packageType) {
        if (price != null && price > 0) {
            options.add(AccessCheckResponse.ParentOption.builder()
                    .entityType(type)
                    .entityId(id)
                    .name(name)
                    .price(price)
                    .packageType(packageType)
                    .build());
        }
    }

    private boolean hasPurchasedParent(Long userId, String parentType, Long parentId, String requiredPhase) {
        List<com.groupsguru.payment.Purchase> parentPurchases = purchaseRepository.findAllByUserIdAndEntityTypeAndEntityIdAndStatus(userId, parentType, parentId, "SUCCESS");
        for (com.groupsguru.payment.Purchase p : parentPurchases) {
            String pt = p.getPackageType();
            if (pt == null || "COMPLETE".equals(pt) || "BOTH".equals(requiredPhase) || pt.equals(requiredPhase) || requiredPhase == null) {
                return true;
            }
        }

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
            return hasPurchasedParent(userId, nextParentType, nextParentId, requiredPhase);
        }

        return false;
    }
}
