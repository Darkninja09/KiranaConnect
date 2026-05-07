package com.kiranaconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String id;
    private String email;
    private String name;
    private String shopName;
    private String role;
}
