package com.groupsguru.payment;

import com.groupsguru.access.AccessService;
import com.groupsguru.auth.AuthService;
import com.groupsguru.common.ApiResponse;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final PurchaseRepository purchaseRepository;
    private final AuthService authService;
    private final AccessService accessService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<String>> createOrder(@RequestBody CreateOrderRequest request) throws RazorpayException {
        Long userId = authService.getCurrentUser().getId();
        
        // Use AccessService to get the price
        var accessInfo = accessService.checkAccess(userId, request.getEntityType(), request.getEntityId());
        Double price = accessInfo.getPrice();
        
        // If they specify a packageType for a CATEGORY, we need to find that exact parentOption price
        if (request.getPackageType() != null && !request.getPackageType().isEmpty()) {
            boolean foundPackage = false;
            for (var opt : accessInfo.getParentOptions()) {
                if (opt.getEntityType().equalsIgnoreCase(request.getEntityType()) 
                    && opt.getEntityId().equals(request.getEntityId())
                    && request.getPackageType().equalsIgnoreCase(opt.getPackageType())) {
                    price = opt.getPrice();
                    foundPackage = true;
                    break;
                }
            }
            if (!foundPackage && "CATEGORY".equalsIgnoreCase(request.getEntityType())) {
                // strict check, if packageType didn't match an option (e.g., they asked for MAINS but no mains price exists)
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid package type for this category"));
            }
        }

        if (price == null || price <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid price or entity is free"));
        }

        String receipt = "receipt_" + userId + "_" + System.currentTimeMillis();
        String orderId = razorpayService.createOrder(price, "INR", receipt);

        Purchase purchase = Purchase.builder()
                .userId(userId)
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
                .packageType(request.getPackageType() != null && !request.getPackageType().isEmpty() ? request.getPackageType().toUpperCase() : "COMPLETE")
                .razorpayOrderId(orderId)
                .amount(price)
                .currency("INR")
                .status("CREATED")
                .build();
        
        purchaseRepository.save(purchase);

        return ResponseEntity.ok(ApiResponse.success(orderId));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        boolean isValid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (isValid) {
            Purchase purchase = purchaseRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            
            purchase.setRazorpayPaymentId(request.getRazorpayPaymentId());
            purchase.setRazorpaySignature(request.getRazorpaySignature());
            purchase.setStatus("SUCCESS");
            purchaseRepository.save(purchase);

            return ResponseEntity.ok(ApiResponse.success("Payment verified successfully"));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid payment signature"));
        }
    }
}
