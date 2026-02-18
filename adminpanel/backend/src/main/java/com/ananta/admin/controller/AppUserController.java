package com.ananta.admin.controller;

import com.ananta.admin.model.KYC;
import com.ananta.admin.model.User;
import com.ananta.admin.payload.KycStatusResponse;
import com.ananta.admin.payload.MessageResponse;
import com.ananta.admin.payload.OtpVerifyRequest;
import com.ananta.admin.payload.OtpVerifyResponse;
import com.ananta.admin.payload.RegisterRequest;
import com.ananta.admin.repository.KYCRepository;
import com.ananta.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/app")
public class AppUserController {

    private static final String FIXED_OTP = "12345";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KYCRepository kycRepository;

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyRequest request) {
        if (!StringUtils.hasText(request.getPhone()) || !StringUtils.hasText(request.getOtp())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Phone and OTP are required"));
        }

        if (!FIXED_OTP.equals(request.getOtp())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid OTP"));
        }

        String phone = request.getPhone().trim();

        Optional<User> existing = userRepository.findByPhone(phone);
        User user = existing.orElseGet(() -> {
            User u = new User();
            u.setPhone(phone);
            u.setUsername("user_" + phone.substring(Math.max(0, phone.length() - 4)));
            u.setUserId(generateUserId());
            return userRepository.save(u);
        });

        Optional<KYC> kycOpt = kycRepository.findByUserId(user.getUserId());
        String kycStatus = kycOpt.map(k -> k.getStatus().name()).orElse("NONE");
        boolean hasProfile = StringUtils.hasText(user.getFullName());

        return ResponseEntity.ok(new OtpVerifyResponse(
                user.getUserId(),
                user.getPhone(),
                kycStatus,
                hasProfile
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (!StringUtils.hasText(request.getUserId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("UserId is required"));
        }
        if (!StringUtils.hasText(request.getUsername())
                || !StringUtils.hasText(request.getEmail())
                || !StringUtils.hasText(request.getFullName())
                || !StringUtils.hasText(request.getCity())
                || !StringUtils.hasText(request.getState())
                || !StringUtils.hasText(request.getCountry())
                || !StringUtils.hasText(request.getPinCode())
                || !StringUtils.hasText(request.getDocumentType())
                || !StringUtils.hasText(request.getDocumentNumber())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Please fill all required fields"));
        }

        User user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found for registration"));

        user.setUsername(request.getUsername().trim());
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail());
        user.setGender(request.getGender());
        user.setBirthday(request.getBirthday());
        user.setBio(request.getBio());
        user.setAddressLine1(request.getAddressLine1());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setCountry(request.getCountry());
        user.setPinCode(request.getPinCode());
        user.setLocation(request.getLocation());

        userRepository.save(user);

        KYC kyc = kycRepository.findByUserId(user.getUserId())
                .orElseGet(() -> {
                    KYC k = new KYC();
                    k.setUserId(user.getUserId());
                    return k;
                });

        kyc.setFullName(request.getFullName().trim());
        kyc.setDocumentType(mapDocumentType(request.getDocumentType()));
        kyc.setDocumentNumber(request.getDocumentNumber().trim());
        kyc.setStatus(KYC.KYCStatus.PENDING);

        kycRepository.save(kyc);

        return ResponseEntity.ok(new MessageResponse("KYC submitted, pending review"));
    }

    @GetMapping("/kyc-status/{userId}")
    public ResponseEntity<?> getKycStatus(@PathVariable String userId) {
        Optional<KYC> kycOpt = kycRepository.findByUserId(userId);
        String status = kycOpt.map(k -> k.getStatus().name()).orElse("NONE");
        return ResponseEntity.ok(new KycStatusResponse(userId, status));
    }

    private KYC.DocumentType mapDocumentType(String documentType) {
        if (!StringUtils.hasText(documentType)) {
            return KYC.DocumentType.AADHAR;
        }
        String value = documentType.trim().toUpperCase(Locale.ROOT);
        if (value.contains("AADHAAR") || value.contains("AADHAR")) {
            return KYC.DocumentType.AADHAR;
        }
        if (value.contains("PASSPORT")) {
            return KYC.DocumentType.PASSPORT;
        }
        if (value.contains("DRIVING")) {
            return KYC.DocumentType.DRIVING_LICENSE;
        }
        return KYC.DocumentType.AADHAR;
    }

    private String generateUserId() {
        String suffix = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase(Locale.ROOT);
        return "AN" + suffix;
    }
}
