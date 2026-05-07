package com.kiranaconnect.repositories;

import com.kiranaconnect.models.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByVendorIdOrderByCreatedAtDesc(String vendorId);
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}
