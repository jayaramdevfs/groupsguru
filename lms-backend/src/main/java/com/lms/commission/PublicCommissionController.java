package com.lms.commission;

import com.lms.commission.dto.CommissionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
public class PublicCommissionController {

    private final CommissionService commissionService;

    @GetMapping
    public ResponseEntity<List<CommissionResponse>> getAllCommissions() {
        return ResponseEntity.ok(commissionService.getAllCommissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommissionResponse> getCommissionById(@PathVariable Long id) {
        return ResponseEntity.ok(commissionService.getCommissionById(id));
    }
}
