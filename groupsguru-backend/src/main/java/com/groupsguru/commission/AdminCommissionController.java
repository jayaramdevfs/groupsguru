package com.groupsguru.commission;

import com.groupsguru.commission.dto.CommissionRequest;
import com.groupsguru.commission.dto.CommissionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/commissions")
@RequiredArgsConstructor
public class AdminCommissionController {

    private final CommissionService commissionService;

    @PostMapping
    public ResponseEntity<CommissionResponse> createCommission(@Valid @RequestBody CommissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commissionService.createCommission(request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommissionResponse> updateCommission(@PathVariable Long id, @RequestBody CommissionRequest request) {
        return ResponseEntity.ok(commissionService.updateCommission(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommission(@PathVariable Long id) {
        commissionService.deleteCommission(id);
        return ResponseEntity.noContent().build();
    }
}
