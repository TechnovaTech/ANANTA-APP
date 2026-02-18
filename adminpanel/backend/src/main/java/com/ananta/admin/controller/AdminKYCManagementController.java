package com.ananta.admin.controller;

import com.ananta.admin.model.KYC;
import com.ananta.admin.payload.MessageResponse;
import com.ananta.admin.repository.KYCRepository;
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
@RequestMapping("/api/admin/kyc")
public class AdminKYCManagementController {

    @Autowired
    private KYCRepository kycRepository;

    @GetMapping
    public Map<String, Object> getKycRequests() {
        List<KYC> list = kycRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("kycRequests", list);
        return response;
    }

    @PostMapping
    public ResponseEntity<?> handleKycAction(@RequestBody Map<String, String> payload) {
        String kycIdStr = payload.get("kycId");
        String action = payload.get("action");
        if (kycIdStr == null || action == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("kycId and action are required"));
        }

        Long kycId = Long.parseLong(kycIdStr);
        KYC kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new RuntimeException("KYC not found"));

        if ("approve".equalsIgnoreCase(action)) {
            kyc.setStatus(KYC.KYCStatus.APPROVED);
        } else if ("reject".equalsIgnoreCase(action)) {
            kyc.setStatus(KYC.KYCStatus.REJECTED);
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid action"));
        }

        kycRepository.save(kyc);
        return ResponseEntity.ok(new MessageResponse("KYC updated successfully"));
    }
}
