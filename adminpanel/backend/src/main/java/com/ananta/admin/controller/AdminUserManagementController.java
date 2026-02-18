package com.ananta.admin.controller;

import com.ananta.admin.model.KYC;
import com.ananta.admin.model.User;
import com.ananta.admin.payload.MessageResponse;
import com.ananta.admin.repository.KYCRepository;
import com.ananta.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(
        origins = {
                "http://localhost:8081",
                "http://localhost:19006",
                "http://localhost:3000"
        },
        maxAge = 3600
)
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserManagementController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KYCRepository kycRepository;

    @GetMapping
    public Map<String, Object> getUsers() {
        List<User> users = userRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("users", users);
        return response;
    }

    @PatchMapping
    public ResponseEntity<?> updateUserFlags(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("userId is required"));
        }
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (payload.containsKey("isBlocked")) {
            Object value = payload.get("isBlocked");
            if (value instanceof Boolean) {
                user.setBlocked((Boolean) value);
            }
        }
        if (payload.containsKey("isBanned")) {
            Object value = payload.get("isBanned");
            if (value instanceof Boolean) {
                user.setBanned((Boolean) value);
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User updated successfully"));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserDetail(@PathVariable String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        KYC kyc = kycRepository.findByUserId(userId).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("kyc", kyc);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable String userId,
            @RequestBody User updated
    ) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(updated.getUsername());
        user.setEmail(updated.getEmail());
        user.setFullName(updated.getFullName());
        user.setPhone(updated.getPhone());
        user.setGender(updated.getGender());
        user.setBirthday(updated.getBirthday());
        user.setBio(updated.getBio());
        user.setAddressLine1(updated.getAddressLine1());
        user.setCity(updated.getCity());
        user.setState(updated.getState());
        user.setCountry(updated.getCountry());
        user.setPinCode(updated.getPinCode());
        user.setLocation(updated.getLocation());

        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User updated successfully"));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        userRepository.findByUserId(userId).ifPresent(userRepository::delete);
        kycRepository.findByUserId(userId).ifPresent(kycRepository::delete);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
}
