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
        Object idObj = payload.get("id");
        User user = null;
        if (idObj instanceof Number) {
            Long id = ((Number) idObj).longValue();
            user = userRepository.findById(id).orElse(null);
        } else if (idObj instanceof String) {
            try {
                Long id = Long.parseLong(((String) idObj).trim());
                user = userRepository.findById(id).orElse(null);
            } catch (NumberFormatException ignored) {
            }
        }

        if (user == null) {
            String userId = (String) payload.get("userId");
            String normalizedUserId = userId == null ? "" : userId.trim();
            if (normalizedUserId.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("userId is required"));
            }
            String compactUserId = normalizedUserId.replaceAll("[^A-Za-z0-9]", "");
            user = userRepository.findByUserId(normalizedUserId).orElse(null);
            if (user == null) {
                user = userRepository.findByUserIdTrimmed(normalizedUserId).orElse(null);
            }
            if (user == null && !compactUserId.isEmpty()) {
                user = userRepository.findByUserIdNormalized(compactUserId).orElse(null);
            }
        }

        if (user == null) {
            return ResponseEntity.status(404).body(new MessageResponse("User not found"));
        }

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
        String normalizedUserId = userId == null ? "" : userId.trim();
        String compactUserId = normalizedUserId.replaceAll("[^A-Za-z0-9]", "");
        User user = userRepository.findByUserId(normalizedUserId).orElse(null);
        if (user == null) {
            user = userRepository.findByUserIdTrimmed(normalizedUserId).orElse(null);
        }
        if (user == null && !compactUserId.isEmpty()) {
            user = userRepository.findByUserIdNormalized(compactUserId).orElse(null);
        }
        if (user == null && !compactUserId.isEmpty()) {
            user = userRepository.findFirstByUserIdLikeNormalized(compactUserId).orElse(null);
        }
        if (user == null) {
            user = userRepository.findByUsername(normalizedUserId).orElse(null);
        }
        if (user == null) {
            user = userRepository.findByPhone(normalizedUserId).orElse(null);
        }
        if (user == null && !normalizedUserId.isEmpty()) {
            String key = normalizeUserIdValue(normalizedUserId);
            try {
                List<User> allUsers = userRepository.findAll();
                for (User candidate : allUsers) {
                    if (key.equals(normalizeUserIdValue(candidate.getUserId()))) {
                        user = candidate;
                        break;
                    }
                }
            } catch (Exception ignored) {
            }
        }

        KYC kyc = kycRepository.findByUserId(normalizedUserId).orElse(null);
        if (kyc == null) {
            kyc = kycRepository.findByUserIdTrimmed(normalizedUserId).orElse(null);
        }
        if (kyc == null && !compactUserId.isEmpty()) {
            kyc = kycRepository.findByUserIdNormalized(compactUserId).orElse(null);
        }
        if (kyc == null && !compactUserId.isEmpty()) {
            kyc = kycRepository.findFirstByUserIdLikeNormalized(compactUserId).orElse(null);
        }
        if (kyc == null) {
            kyc = kycRepository.findByFullName(normalizedUserId).orElse(null);
        }
        if (kyc == null && !normalizedUserId.isEmpty()) {
            String key = normalizeUserIdValue(normalizedUserId);
            try {
                List<KYC> allKyc = kycRepository.findAll();
                for (KYC candidate : allKyc) {
                    if (key.equals(normalizeUserIdValue(candidate.getUserId()))) {
                        kyc = candidate;
                        break;
                    }
                }
            } catch (Exception ignored) {
            }
        }

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
        String normalizedUserId = userId == null ? "" : userId.trim();
        String compactUserId = normalizedUserId.replaceAll("[^A-Za-z0-9]", "");
        User user = userRepository.findByUserId(normalizedUserId)
                .orElseGet(() -> userRepository.findByUserIdTrimmed(normalizedUserId)
                        .orElse(null));
        if (user == null && !compactUserId.isEmpty()) {
            user = userRepository.findByUserIdNormalized(compactUserId).orElse(null);
        }
        if (user == null) {
            throw new RuntimeException("User not found");
        }

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
        String normalizedUserId = userId == null ? "" : userId.trim();
        String compactUserId = normalizedUserId.replaceAll("[^A-Za-z0-9]", "");

        User user = userRepository.findByUserId(normalizedUserId).orElse(null);
        if (user == null) {
            user = userRepository.findByUserIdTrimmed(normalizedUserId).orElse(null);
        }
        if (user == null && !compactUserId.isEmpty()) {
            user = userRepository.findByUserIdNormalized(compactUserId).orElse(null);
        }
        if (user == null) {
            return ResponseEntity.status(404).body(new MessageResponse("User not found"));
        }

        user.setBlocked(true);
        user.setBanned(true);
        userRepository.save(user);

        kycRepository.findByUserId(normalizedUserId).ifPresent(kycRepository::delete);
        kycRepository.findByUserIdTrimmed(normalizedUserId).ifPresent(kycRepository::delete);
        if (!compactUserId.isEmpty()) {
            kycRepository.findByUserIdNormalized(compactUserId).ifPresent(kycRepository::delete);
        }

        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }

    private String normalizeUserIdValue(String value) {
        if (value == null) {
            return "";
        }
        return value.replaceAll("[^A-Za-z0-9]", "").toUpperCase(java.util.Locale.ROOT);
    }
}
