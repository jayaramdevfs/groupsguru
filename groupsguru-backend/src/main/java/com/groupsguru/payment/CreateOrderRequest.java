package com.groupsguru.payment;

import lombok.Data;
import jakarta.validation.constraints.*;
@Data
public class CreateOrderRequest {
    @Positive private Double amount;
    @NotBlank private String entityType;
    @NotNull private Long entityId;
    private String packageType; // COMPLETE, PRELIMS, MAINS
}
