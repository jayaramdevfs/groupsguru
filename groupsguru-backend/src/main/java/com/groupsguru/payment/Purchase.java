package com.groupsguru.payment;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "purchases")
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String entityType; // COMMISSION, CATEGORY, etc.

    private Long entityId;

    private String packageType; // COMPLETE, PRELIMS, MAINS

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private Double amount;

    private String currency;

    private String status; // CREATED, SUCCESS, FAILED

    @CreationTimestamp
    private LocalDateTime createdAt;
}
