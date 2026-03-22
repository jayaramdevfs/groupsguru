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
        
        if (price == null || price <= 0) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid price or entity is free"));
        }

        String receipt = "receipt_" + userId + "_" + System.currentTimeMillis();
        String orderId = razorpayService.createOrder(price, "INR", receipt);

        Purchase purchase = Purchase.builder()
                .userId(userId)
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
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
