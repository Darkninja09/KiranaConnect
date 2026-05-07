package com.kiranaconnect.controllers;

import com.kiranaconnect.models.Order;
import com.kiranaconnect.repositories.OrderRepository;
import com.kiranaconnect.repositories.ProductRepository;
import com.kiranaconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@PreAuthorize("hasAuthority('ADMIN')")
public class DashboardController {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        
        double totalRevenue = orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != Order.OrderStatus.PENDING && order.getStatus() != Order.OrderStatus.CANCELLED)
                .mapToDouble(Order::getTotalAmount)
                .sum();

        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalRevenue", totalRevenue);
        
        // Out of stock items
        long outOfStock = productRepository.findAll().stream()
                .filter(p -> p.getStockLevel() <= 0)
                .count();
        stats.put("outOfStock", outOfStock);

        return stats;
    }
}
