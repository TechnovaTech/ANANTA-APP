package com.ananta.admin.controller;

import com.ananta.admin.model.ReferralTier;
import com.ananta.admin.repository.ReferralTierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = {"http://localhost:3011", "http://localhost:8081", "http://localhost:19006"}, maxAge = 3600)
@RestController
@RequestMapping("/api/admin/referral")
public class AdminReferralController {

    @Autowired
    private ReferralTierRepository referralTierRepository;

    @GetMapping
    public ResponseEntity<?> getTiers() {
        List<ReferralTier> tiers = referralTierRepository.findAll();
        tiers.sort(Comparator.comparing(ReferralTier::getShares));
        Map<String, Object> response = new HashMap<>();
        response.put("tiers", tiers);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> saveTiers(@RequestBody Map<String, List<Map<String, Integer>>> payload) {
        List<Map<String, Integer>> incoming = payload.get("tiers");
        if (incoming == null) return ResponseEntity.badRequest().body(Map.of("message", "tiers field required"));

        // Replace all existing tiers
        referralTierRepository.deleteAll();

        List<ReferralTier> saved = new ArrayList<>();
        for (Map<String, Integer> t : incoming) {
            ReferralTier tier = new ReferralTier();
            tier.setShares(t.get("shares"));
            tier.setCoins(t.get("coins"));
            saved.add(referralTierRepository.save(tier));
        }
        saved.sort(Comparator.comparing(ReferralTier::getShares));

        Map<String, Object> response = new HashMap<>();
        response.put("tiers", saved);
        response.put("message", "Referral tiers saved successfully");
        return ResponseEntity.ok(response);
    }
}
