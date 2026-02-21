package com.ananta.admin.controller;

import com.ananta.admin.model.Gift;
import com.ananta.admin.model.Wallet;
import com.ananta.admin.model.WalletTransaction;
import com.ananta.admin.payload.MessageResponse;
import com.ananta.admin.repository.GiftRepository;
import com.ananta.admin.repository.WalletRepository;
import com.ananta.admin.repository.WalletTransactionRepository;
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
@RequestMapping("/api/app/gifts")
public class AppGiftController {

    @Autowired
    private GiftRepository giftRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @GetMapping
    public ResponseEntity<?> listActiveGifts() {
        List<Gift> gifts = giftRepository.findByActiveTrueOrderByCoinValueAsc();
        return ResponseEntity.ok(gifts);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendGift(@RequestBody Map<String, Object> payload) {
        Object fromIdObj = payload.get("fromUserId");
        Object toIdObj = payload.get("toUserId");
        Object giftIdObj = payload.get("giftId");

        if (fromIdObj == null || toIdObj == null || giftIdObj == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("fromUserId, toUserId and giftId are required"));
        }

        String fromUserId = fromIdObj.toString();
        String toUserId = toIdObj.toString();
        if (fromUserId.equals(toUserId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Cannot send gift to same user"));
        }

        Long giftId;
        try {
            giftId = Long.parseLong(giftIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid giftId"));
        }

        Gift gift = giftRepository.findById(giftId)
                .orElseThrow(() -> new RuntimeException("Gift not found"));
        if (!gift.isActive() || gift.getCoinValue() == null || gift.getCoinValue() <= 0) {
            return ResponseEntity.badRequest().body(new MessageResponse("Gift is not available"));
        }

        int coinValue = gift.getCoinValue();

        Wallet fromWallet = walletRepository.findByUserId(fromUserId)
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUserId(fromUserId);
                    return walletRepository.save(w);
                });
        Wallet toWallet = walletRepository.findByUserId(toUserId)
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUserId(toUserId);
                    return walletRepository.save(w);
                });

        double fromBalance = fromWallet.getBalance() != null ? fromWallet.getBalance() : 0.0;
        double toBalance = toWallet.getBalance() != null ? toWallet.getBalance() : 0.0;

        if (fromBalance < coinValue) {
            return ResponseEntity.badRequest().body(new MessageResponse("Insufficient balance"));
        }

        fromWallet.setBalance(fromBalance - coinValue);
        toWallet.setBalance(toBalance + coinValue);
        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        recordTransaction(fromUserId, coinValue, false, "GIFT_SENT", "Gift sent: " + gift.getName());
        recordTransaction(toUserId, coinValue, true, "GIFT_RECEIVED", "Gift received: " + gift.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("fromUserId", fromUserId);
        response.put("toUserId", toUserId);
        response.put("giftId", giftId);
        response.put("giftName", gift.getName());
        response.put("coinValue", coinValue);
        response.put("fromBalance", fromWallet.getBalance());
        response.put("toBalance", toWallet.getBalance());
        return ResponseEntity.ok(response);
    }

    private void recordTransaction(String userId, double amount, boolean credit, String type, String note) {
        WalletTransaction tx = new WalletTransaction();
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setCredit(credit);
        tx.setType(type);
        tx.setNote(note);
        walletTransactionRepository.save(tx);
    }
}
