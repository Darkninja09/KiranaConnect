package com.kiranaconnect.controllers;

import com.kiranaconnect.models.Order;
import com.kiranaconnect.models.OrderItem;
import com.kiranaconnect.repositories.OrderRepository;
import com.kiranaconnect.repositories.ProductRepository;
import com.kiranaconnect.services.InventoryService;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    InventoryService inventoryService;

    @Value("${kiranaconnect.razorpay.keyId}")
    private String razorpayKeyId;

    @Value("${kiranaconnect.razorpay.keySecret}")
    private String razorpayKeySecret;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Order orderDetails) {
        try {
            // 1. Initialize Razorpay Client
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            // 2. Create Razorpay Order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (orderDetails.getTotalAmount() * 100)); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);

            // 3. Save Order to Database as PENDING
            orderDetails.setRazorpayOrderId(razorpayOrder.get("id"));
            orderDetails.setStatus(Order.OrderStatus.PENDING);
            orderDetails.setCreatedAt(LocalDateTime.now());
            
            Order savedOrder = orderRepository.save(orderDetails);

            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating Razorpay order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> response) {
        String razorpayOrderId = response.get("razorpay_order_id");
        String razorpayPaymentId = response.get("razorpay_payment_id");
        String razorpaySignature = response.get("razorpay_signature");

        try {
            // Verify signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValid) {
                Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

                order.setStatus(Order.OrderStatus.PAID);
                order.setRazorpayPaymentId(razorpayPaymentId);
                order.setRazorpaySignature(razorpaySignature);
                orderRepository.save(order);

                // Deduct stock after successful payment
                inventoryService.deductStockForOrder(order);

                return ResponseEntity.ok(Map.of("message", "Payment successful and verified"));
            } else {
                return ResponseEntity.badRequest().body("Invalid payment signature");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Verification error: " + e.getMessage());
        }
    }

    @GetMapping("/user/{vendorId}")
    public List<Order> getUserOrders(@PathVariable String vendorId) {
        return orderRepository.findByVendorIdOrderByCreatedAtDesc(vendorId);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> statusRequest) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(Order.OrderStatus.valueOf(statusRequest.get("status")));
                    orderRepository.save(order);
                    return ResponseEntity.ok(Map.of("message", "Order status updated successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
