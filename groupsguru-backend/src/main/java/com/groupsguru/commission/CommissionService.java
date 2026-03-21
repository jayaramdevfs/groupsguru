package com.groupsguru.commission;

import com.groupsguru.commission.dto.CommissionRequest;
import com.groupsguru.commission.dto.CommissionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommissionService {

    private final CommissionRepository commissionRepository;

    public List<CommissionResponse> getAllCommissions() {
        return commissionRepository.findByIsDeletedFalseOrderByDisplayOrderAsc().stream()
                .map(CommissionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public CommissionResponse getCommissionById(Long id) {
        return CommissionResponse.fromEntity(getEntityById(id));
    }

    public CommissionResponse createCommission(CommissionRequest request) {
        if (commissionRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Commission code already exists");
        }

        Commission c = Commission.builder()
                .code(request.getCode())
                .name(request.getName())
                .nameTe(request.getNameTe())
                .description(request.getDescription())
                .descriptionTe(request.getDescriptionTe())
                .imageUrl(request.getImageUrl())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .accessType(request.getAccessType() != null ? request.getAccessType() : "FREE")
                .priceInr(request.getPriceInr())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .isDeleted(false)
                .build();
        return CommissionResponse.fromEntity(commissionRepository.save(c));
    }

    public CommissionResponse updateCommission(Long id, CommissionRequest request) {
        Commission c = getEntityById(id);
        
        if (request.getCode() != null && !request.getCode().isBlank() && !request.getCode().equals(c.getCode())) {
            if (commissionRepository.existsByCode(request.getCode())) {
                throw new RuntimeException("Commission code already exists");
            }
            c.setCode(request.getCode());
        }
        
        if (request.getName() != null && !request.getName().isBlank()) c.setName(request.getName());
        if (request.getNameTe() != null && !request.getNameTe().isBlank()) c.setNameTe(request.getNameTe());
        if (request.getDescription() != null) c.setDescription(request.getDescription());
        if (request.getDescriptionTe() != null) c.setDescriptionTe(request.getDescriptionTe());
        if (request.getImageUrl() != null) c.setImageUrl(request.getImageUrl());
        if (request.getDisplayOrder() != null) c.setDisplayOrder(request.getDisplayOrder());
        if (request.getAccessType() != null) c.setAccessType(request.getAccessType());
        if (request.getPriceInr() != null) c.setPriceInr(request.getPriceInr());
        if (request.getIsActive() != null) c.setActive(request.getIsActive());

        return CommissionResponse.fromEntity(commissionRepository.save(c));
    }

    public void deleteCommission(Long id) {
        Commission c = getEntityById(id);
        c.setDeleted(true);
        commissionRepository.save(c);
    }

    public Commission getEntityById(Long id) {
        Commission c = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission not found"));
        if (c.isDeleted()) throw new RuntimeException("Commission not found");
        return c;
    }
}
