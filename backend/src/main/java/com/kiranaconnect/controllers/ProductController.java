package com.kiranaconnect.controllers;

import com.kiranaconnect.models.Product;
import com.kiranaconnect.repositories.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String category, 
                                        @RequestParam(required = false) String name) {
        if (category != null) {
            return productRepository.findByCategory(category);
        }
        if (name != null) {
            return productRepository.findByNameContainingIgnoreCase(name);
        }
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Product createProduct(@Valid @RequestBody Product product) {
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @Valid @RequestBody Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setCategory(productDetails.getCategory());
                    product.setWholesalePrice(productDetails.getWholesalePrice());
                    product.setMinOrderQty(productDetails.getMinOrderQty());
                    product.setStockLevel(productDetails.getStockLevel());
                    product.setImageUrl(productDetails.getImageUrl());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable String id) {
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
