package com.kiranaconnect.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String vendorId;
    private String shopName;
    private List<OrderItem> items;
    private Double totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    
    // Razorpay specific fields
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    public enum OrderStatus {
        PENDING,
        PAID,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }
}
