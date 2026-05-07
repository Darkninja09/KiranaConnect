package com.kiranaconnect.security;

import com.kiranaconnect.models.User;
import com.kiranaconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("--- Security check for email: [" + email + "] ---");
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("!!! User NOT found in database for email: [" + email + "]");
                    return new UsernameNotFoundException("User Not Found with email: " + email);
                });

        System.out.println(">>> User found: [" + user.getEmail() + "] with role: " + user.getRole());
        return UserDetailsImpl.build(user);
    }
}
