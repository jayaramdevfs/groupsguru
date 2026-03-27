package com.groupsguru.payment;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private String entityType;
    private Long entityId;
    private String packageType; // COMPLETE, PRELIMS, MAINS
}
