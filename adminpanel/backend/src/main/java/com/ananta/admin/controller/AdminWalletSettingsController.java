package com.ananta.admin.controller;

import com.ananta.admin.model.RechargePlan;
import com.ananta.admin.repository.RechargePlanRepository;
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
@RequestMapping("/api/admin/wallet")
public class AdminWalletSettingsController {

    @Autowired
    private RechargePlanRepository rechargePlanRepository;

    @GetMapping("/plans")
    public ResponseEntity<?> getPlans() {
        List<RechargePlan> plans = rechargePlanRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("plans", plans);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/plans")
    public ResponseEntity<?> createPlan(@RequestBody RechargePlan plan) {
        plan.setId(null);
        RechargePlan saved = rechargePlanRepository.save(plan);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable Long id, @RequestBody RechargePlan payload) {
        RechargePlan existing = rechargePlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        existing.setName(payload.getName());
        existing.setCoins(payload.getCoins());
        existing.setPrice(payload.getPrice());
        existing.setPopular(payload.isPopular());
        existing.setActive(payload.isActive());
        RechargePlan saved = rechargePlanRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable Long id) {
        if (!rechargePlanRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        rechargePlanRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

