package com.kiranaconnect.controllers;

import com.kiranaconnect.dto.*;
import com.kiranaconnect.models.Role;
import com.kiranaconnect.models.User;
import com.kiranaconnect.repositories.UserRepository;
import com.kiranaconnect.security.JwtUtils;
import com.kiranaconnect.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/ping")
    public String ping() {
        return "Auth endpoint is accessible!";
    }

    @GetMapping("/debug/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("--- Login Request for: [" + loginRequest.getEmail() + "] ---");
            System.out.print("Current DB Users: ");
            userRepository.findAll().forEach(u -> System.out.print("[" + u.getEmail() + "] "));
            System.out.println();
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .findFirst().orElse("VENDOR");

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getName(),
                    userDetails.getShopName(),
                    role));
        } catch (Exception e) {
            System.out.println("!!! Login Failed: " + e.getMessage());
            return ResponseEntity
                    .status(401)
                    .body(new MessageResponse("Error: Invalid email or password!"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        System.out.println("--- Signup Attempt for: [" + signUpRequest.getEmail() + "] ---");
        
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            System.out.println("!!! Signup Failed: Email already exists.");
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .shopName(signUpRequest.getShopName())
                .email(signUpRequest.getEmail().trim().toLowerCase()) // Sanitize
                .password(encoder.encode(signUpRequest.getPassword()))
                .address(signUpRequest.getAddress())
                .build();

        String strRole = signUpRequest.getRole();
        user.setRole(strRole != null && strRole.equalsIgnoreCase("ADMIN") ? Role.ADMIN : Role.VENDOR);

        User savedUser = userRepository.save(user);
        System.out.println(">>> User saved successfully! ID: " + savedUser.getId());
        
        System.out.print("DB Users after save: ");
        userRepository.findAll().forEach(u -> System.out.print("[" + u.getEmail() + "] "));
        System.out.println();

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
