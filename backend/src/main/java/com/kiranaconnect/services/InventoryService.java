package com.kiranaconnect.services;

import com.kiranaconnect.models.Order;
import com.kiranaconnect.models.OrderItem;
import com.kiranaconnect.models.Product;
import com.kiranaconnect.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public void deductStockForOrder(Order order) {
        if (order.getItems() == null) return;

        for (OrderItem item : order.getItems()) {
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                int currentStock = product.getStockLevel() != null ? product.getStockLevel() : 0;
                int quantityOrdered = item.getQuantity();
                
                // Deduct stock, ensuring it doesn't go below 0 (unless allowed by business logic)
                product.setStockLevel(Math.max(0, currentStock - quantityOrdered));
                productRepository.save(product);
                
                System.out.println("Inventory Updated: Product " + product.getName() + 
                                   " | Deducted: " + quantityOrdered + 
                                   " | New Stock: " + product.getStockLevel());
            });
        }
    }
}
