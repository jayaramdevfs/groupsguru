package com.groupsguru.payment;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class VerifyPaymentRequest {
    @NotBlank private String razorpayOrderId;
    @NotBlank private String razorpayPaymentId;
    @NotBlank private String razorpaySignature;
}
