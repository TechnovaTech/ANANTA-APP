package com.ananta.admin.controller;

import com.ananta.admin.model.DailyRecharge;
import com.ananta.admin.repository.DailyRechargeRepository;
import com.ananta.admin.repository.WalletRepository;
import com.ananta.admin.model.Wallet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/recharges")
public class RechargeController {
    @Autowired
    DailyRechargeRepository rechargeRepository;

    @Autowired
    WalletRepository walletRepository;

    @GetMapping
    public ResponseEntity<?> getAllRecharges() {
        List<DailyRecharge> recharges = rechargeRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("recharges", recharges);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> handleRechargeAction(@RequestBody Map<String, String> payload) {
        Long id = Long.parseLong(payload.get("rechargeId"));
        String action = payload.get("action");

        DailyRecharge recharge = rechargeRepository.findById(id).orElseThrow(() -> new RuntimeException("Recharge not found"));
        
        if ("approve".equalsIgnoreCase(action)) {
             if (recharge.getStatus() != DailyRecharge.RechargeStatus.PENDING) {
                  return ResponseEntity.badRequest().body("Recharge already processed");
             }
             recharge.setStatus(DailyRecharge.RechargeStatus.APPROVED);
             rechargeRepository.save(recharge);
             // Update Wallet
             Wallet wallet = walletRepository.findByUserId(recharge.getUserId())
                 .orElseGet(() -> {
                     Wallet newWallet = new Wallet();
                     newWallet.setUserId(recharge.getUserId());
                     return newWallet;
                 });
             wallet.setBalance(wallet.getBalance() + recharge.getAmount());
             walletRepository.save(wallet);
        } else if ("reject".equalsIgnoreCase(action)) {
             recharge.setStatus(DailyRecharge.RechargeStatus.REJECTED);
             rechargeRepository.save(recharge);
        }
        
        return ResponseEntity.ok("Recharge processed successfully");
    }
}
