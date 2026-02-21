package com.ananta.admin.controller;

import com.ananta.admin.model.DailyRecharge;
import com.ananta.admin.model.KYC;
import com.ananta.admin.model.RechargePlan;
import com.ananta.admin.model.User;
import com.ananta.admin.model.WalletTransaction;
import com.ananta.admin.model.Wallet;
import com.ananta.admin.model.WithdrawRequest;
import com.ananta.admin.model.WithdrawConfig;
import com.ananta.admin.payload.MessageResponse;
import com.ananta.admin.repository.DailyRechargeRepository;
import com.ananta.admin.repository.KYCRepository;
import com.ananta.admin.repository.RechargePlanRepository;
import com.ananta.admin.repository.UserRepository;
import com.ananta.admin.repository.WalletRepository;
import com.ananta.admin.repository.WalletTransactionRepository;
import com.ananta.admin.repository.WithdrawRequestRepository;
import com.ananta.admin.repository.WithdrawConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
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
@RequestMapping("/api/app/wallet")
public class AppWalletController {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private RechargePlanRepository rechargePlanRepository;

    @Autowired
    private DailyRechargeRepository dailyRechargeRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KYCRepository kycRepository;

    @Autowired
    private WithdrawRequestRepository withdrawRequestRepository;

    @Autowired
    private WithdrawConfigRepository withdrawConfigRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable String userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUserId(userId);
                    return walletRepository.save(w);
                });
        Map<String, Object> response = new HashMap<>();
        response.put("userId", wallet.getUserId());
        response.put("balance", wallet.getBalance());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/leaderboard/earning")
    public ResponseEntity<?> getEarningLeaderboard(@RequestParam(name = "limit", defaultValue = "50") int limit) {
        List<Map<String, Object>> items = buildGiftLeaderboard("GIFT_RECEIVED", limit);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/leaderboard/spent")
    public ResponseEntity<?> getSpentLeaderboard(@RequestParam(name = "limit", defaultValue = "50") int limit) {
        List<Map<String, Object>> items = buildGiftLeaderboard("GIFT_SENT", limit);
        return ResponseEntity.ok(items);
    }

    private List<Map<String, Object>> buildGiftLeaderboard(String type, int limit) {
        int safeLimit = limit <= 0 ? 50 : Math.min(limit, 100);
        List<Object[]> rows = walletTransactionRepository.findTopUsersByType(type, safeLimit);
        List<Map<String, Object>> items = new ArrayList<>();
        int rank = 1;
        for (Object[] row : rows) {
            if (row == null || row.length < 2 || row[0] == null) {
                continue;
            }
            String userId = row[0].toString();
            Number coinsNumber = row[1] instanceof Number ? (Number) row[1] : null;
            double coins = coinsNumber != null ? coinsNumber.doubleValue() : 0.0;

            Map<String, Object> m = new HashMap<>();
            m.put("userId", userId);
            m.put("coins", coins);
            m.put("rank", rank++);
            m.put("type", type);

            String username = null;
            String fullName = null;
            String profileImage = null;
            String location = null;

            try {
                User user = userRepository.findByUserId(userId).orElse(null);
                if (user == null && StringUtils.hasText(userId)) {
                    user = userRepository.findByUserIdTrimmed(userId).orElse(null);
                }
                if (user != null) {
                    username = user.getUsername();
                    fullName = user.getFullName();
                    profileImage = user.getProfileImage();
                    StringBuilder sb = new StringBuilder();
                    if (StringUtils.hasText(user.getCity())) {
                        sb.append(user.getCity());
                    }
                    if (StringUtils.hasText(user.getState())) {
                        if (!sb.isEmpty()) {
                            sb.append(", ");
                        }
                        sb.append(user.getState());
                    }
                    if (StringUtils.hasText(user.getCountry())) {
                        if (!sb.isEmpty()) {
                            sb.append(", ");
                        }
                        sb.append(user.getCountry());
                    }
                    if (!sb.isEmpty()) {
                        location = sb.toString();
                    } else if (StringUtils.hasText(user.getLocation())) {
                        location = user.getLocation();
                    }
                }
            } catch (Exception ignored) {
            }

            if (!StringUtils.hasText(username) && !StringUtils.hasText(fullName)) {
                try {
                    KYC kyc = findKycByUserIdLoose(userId);
                    if (kyc != null && StringUtils.hasText(kyc.getFullName())) {
                        fullName = kyc.getFullName();
                        username = kyc.getFullName();
                    }
                } catch (Exception ignored) {
                }
            }

            if (StringUtils.hasText(username)) {
                m.put("username", username);
            }
            if (StringUtils.hasText(fullName)) {
                m.put("fullName", fullName);
            }
            if (StringUtils.hasText(profileImage)) {
                m.put("profileImage", profileImage);
            }
            if (StringUtils.hasText(location)) {
                m.put("location", location);
            }

            items.add(m);
        }
        return items;
    }

    private KYC findKycByUserIdLoose(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        String normalizedUserId = userId.trim();
        String compactUserId = normalizedUserId.replaceAll("[^A-Za-z0-9]", "");
        KYC kyc = null;
        try {
            kyc = kycRepository.findByUserId(normalizedUserId).orElse(null);
            if (kyc == null) {
                kyc = kycRepository.findByUserIdTrimmed(normalizedUserId).orElse(null);
            }
            if (kyc == null && StringUtils.hasText(compactUserId)) {
                kyc = kycRepository.findByUserIdNormalized(compactUserId).orElse(null);
            }
            if (kyc == null && StringUtils.hasText(compactUserId)) {
                kyc = kycRepository.findFirstByUserIdLikeNormalized(compactUserId).orElse(null);
            }
        } catch (Exception ignored) {
        }
        return kyc;
    }


    @GetMapping("/{userId}/transactions")
    public ResponseEntity<?> getTransactions(@PathVariable String userId) {
        List<WalletTransaction> items = walletTransactionRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{userId}/withdrawals")
    public ResponseEntity<?> getWithdrawals(@PathVariable String userId) {
        List<WithdrawRequest> items = withdrawRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/withdraw-config")
    public ResponseEntity<?> getWithdrawConfig() {
        WithdrawConfig config = withdrawConfigRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> {
                    WithdrawConfig c = new WithdrawConfig();
                    c.setCoinAmount(100);
                    c.setRupeeAmount(10.0);
                    return c;
                });
        Map<String, Object> response = new HashMap<>();
        response.put("coinAmount", config.getCoinAmount());
        response.put("rupeeAmount", config.getRupeeAmount());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/plans")
    public ResponseEntity<?> getActivePlans() {
        List<RechargePlan> plans = rechargePlanRepository.findByActiveTrueOrderByPriceAsc();
        Map<String, Object> response = new HashMap<>();
        response.put("plans", plans);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/topup")
    public ResponseEntity<?> topup(@RequestBody Map<String, Object> payload) {
        Object userIdObj = payload.get("userId");
        Object planIdObj = payload.get("planId");
        if (userIdObj == null || planIdObj == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("userId and planId are required"));
        }
        String userId = userIdObj.toString();
        Long planId;
        try {
            planId = Long.parseLong(planIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid planId"));
        }

        RechargePlan plan = rechargePlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        DailyRecharge recharge = new DailyRecharge();
        recharge.setUserId(userId);
        recharge.setAmount(plan.getPrice());
        recharge.setCoins(plan.getCoins());
        recharge.setPlanName(plan.getName());
        recharge.setStatus(DailyRecharge.RechargeStatus.PENDING);
        dailyRechargeRepository.save(recharge);

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("rechargeId", recharge.getId());
        response.put("status", recharge.getStatus().name());
        response.put("amount", plan.getPrice());
        response.put("coins", plan.getCoins());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody Map<String, Object> payload) {
        Object userIdObj = payload.get("userId");
        Object amountObj = payload.get("amount");
        Object nameObj = payload.get("accountHolderName");
        Object bankNameObj = payload.get("bankName");
        Object accountNumberObj = payload.get("accountNumber");
        Object ifscCodeObj = payload.get("ifscCode");
        Object branchNameObj = payload.get("branchName");

        if (userIdObj == null || amountObj == null || nameObj == null || bankNameObj == null
                || accountNumberObj == null || ifscCodeObj == null || branchNameObj == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("All fields are required"));
        }

        String userId = userIdObj.toString();
        double amount;
        try {
            amount = Double.parseDouble(amountObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid amount"));
        }
        if (amount <= 0) {
            return ResponseEntity.badRequest().body(new MessageResponse("Amount must be positive"));
        }

        WithdrawConfig config = withdrawConfigRepository.findTopByOrderByIdAsc()
                .orElseGet(() -> {
                    WithdrawConfig c = new WithdrawConfig();
                    c.setCoinAmount(100);
                    c.setRupeeAmount(10.0);
                    return c;
                });
        double coinsPerRupee = config.getCoinAmount() / config.getRupeeAmount();
        double coinsToDeduct = amount * coinsPerRupee;

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUserId(userId);
                    return walletRepository.save(w);
                });

        double balance = wallet.getBalance() != null ? wallet.getBalance() : 0.0;
        if (balance < coinsToDeduct) {
            return ResponseEntity.badRequest().body(new MessageResponse("Insufficient balance"));
        }

        wallet.setBalance(balance - coinsToDeduct);
        walletRepository.save(wallet);

        WithdrawRequest request = new WithdrawRequest();
        request.setUserId(userId);
        request.setAmount(amount);
        request.setCoinAmount(coinsToDeduct);
        request.setAccountHolderName(nameObj.toString());
        request.setBankName(bankNameObj.toString());
        request.setAccountNumber(accountNumberObj.toString());
        request.setIfscCode(ifscCodeObj.toString());
        request.setBranchName(branchNameObj.toString());
        request.setStatus(WithdrawRequest.WithdrawStatus.PENDING);
        withdrawRequestRepository.save(request);

        WalletTransaction tx = new WalletTransaction();
        tx.setUserId(userId);
        tx.setAmount(coinsToDeduct);
        tx.setCredit(false);
        tx.setType("WITHDRAW_REQUEST");
        tx.setNote("Withdraw request pending");
        walletTransactionRepository.save(tx);

        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("withdrawId", request.getId());
        response.put("status", request.getStatus().name());
        response.put("balance", wallet.getBalance());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> payload) {
        Object fromIdObj = payload.get("fromUserId");
        Object toIdObj = payload.get("toUserId");
        Object amountObj = payload.get("amount");

        if (fromIdObj == null || toIdObj == null || amountObj == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("fromUserId, toUserId and amount are required"));
        }

        String fromUserId = fromIdObj.toString();
        String toUserId = toIdObj.toString();
        if (fromUserId.equals(toUserId)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Cannot transfer to same user"));
        }

        double amount;
        try {
            amount = Double.parseDouble(amountObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid amount"));
        }
        if (amount <= 0) {
            return ResponseEntity.badRequest().body(new MessageResponse("Amount must be positive"));
        }

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

        if (fromBalance < amount) {
            return ResponseEntity.badRequest().body(new MessageResponse("Insufficient balance"));
        }

        fromWallet.setBalance(fromBalance - amount);
        toWallet.setBalance(toBalance + amount);
        walletRepository.save(fromWallet);
        walletRepository.save(toWallet);

        recordTransaction(fromUserId, amount, false, "TRANSFER_SENT", toUserId);
        recordTransaction(toUserId, amount, true, "TRANSFER_RECEIVED", fromUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("fromUserId", fromUserId);
        response.put("toUserId", toUserId);
        response.put("amount", amount);
        response.put("fromBalance", fromWallet.getBalance());
        response.put("toBalance", toWallet.getBalance());
        return ResponseEntity.ok(response);
    }

    private void recordTransaction(String userId, double amount, boolean credit, String type, String otherUserId) {
        WalletTransaction tx = new WalletTransaction();
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setCredit(credit);
        tx.setType(type);
        if (StringUtils.hasText(otherUserId)) {
            tx.setOtherUserId(otherUserId);
            String otherName = resolveUserName(otherUserId);
            tx.setOtherUserName(otherName);
            if ("TRANSFER_SENT".equals(type)) {
                tx.setNote("Sent to " + otherName);
            } else if ("TRANSFER_RECEIVED".equals(type)) {
                tx.setNote("Received from " + otherName);
            }
        }
        walletTransactionRepository.save(tx);
    }

    private String resolveUserName(String userId) {
        return userRepository.findByUserId(userId)
                .map(this::buildDisplayName)
                .orElse(userId);
    }

    private String buildDisplayName(User user) {
        if (StringUtils.hasText(user.getFullName())) {
            return user.getFullName();
        }
        if (StringUtils.hasText(user.getUsername())) {
            return user.getUsername();
        }
        return user.getUserId();
    }
}
