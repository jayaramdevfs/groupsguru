package com.groupsguru.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Optional<Purchase> findByUserIdAndEntityTypeAndEntityIdAndStatus(Long userId, String entityType, Long entityId, String status);
    Optional<Purchase> findByRazorpayOrderId(String razorpayOrderId);
}
