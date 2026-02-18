package com.ananta.admin.controller;

import com.ananta.admin.model.KYC;
import com.ananta.admin.repository.KYCRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/kyc")
public class KYCController {
    @Autowired
    KYCRepository kycRepository;

    @GetMapping
    public List<KYC> getAllKYC() {
        return kycRepository.findAll();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveKYC(@PathVariable Long id) {
        KYC kyc = kycRepository.findById(id).orElseThrow(() -> new RuntimeException("KYC not found"));
        kyc.setStatus(KYC.KYCStatus.APPROVED);
        kycRepository.save(kyc);
        return ResponseEntity.ok("KYC approved successfully");
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectKYC(@PathVariable Long id) {
        KYC kyc = kycRepository.findById(id).orElseThrow(() -> new RuntimeException("KYC not found"));
        kyc.setStatus(KYC.KYCStatus.REJECTED);
        kycRepository.save(kyc);
        return ResponseEntity.ok("KYC rejected successfully");
    }
}
