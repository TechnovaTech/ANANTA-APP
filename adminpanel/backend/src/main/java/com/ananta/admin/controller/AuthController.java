package com.ananta.admin.controller;

import com.ananta.admin.config.JwtUtils;
import com.ananta.admin.model.Admin;
import com.ananta.admin.payload.JwtResponse;
import com.ananta.admin.payload.LoginRequest;
import com.ananta.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(loginRequest.getEmail());
        
        Admin admin = adminRepository.findByEmail(loginRequest.getEmail()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(jwt,
                admin.getEmail(),
                admin.getRole()));
    }
}
