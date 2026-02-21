package com.ananta.admin.controller;

import com.ananta.admin.model.Wallet;
import com.ananta.admin.model.WalletTransaction;
import com.ananta.admin.model.WithdrawRequest;
import com.ananta.admin.model.WithdrawConfig;
import com.ananta.admin.payload.MessageResponse;
import com.ananta.admin.repository.WalletRepository;
import com.ananta.admin.repository.WalletTransactionRepository;
import com.ananta.admin.repository.WithdrawRequestRepository;
import com.ananta.admin.repository.WithdrawConfigRepository;
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
@RequestMapping("/api/admin/withdrawals")
public class WithdrawController {

    @Autowired
    private WithdrawRequestRepository withdrawRequestRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Autowired
    private WithdrawConfigRepository withdrawConfigRepository;

    @GetMapping
    public ResponseEntity<?> getAllWithdrawals() {
        List<WithdrawRequest> items = withdrawRequestRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("withdrawals", items);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/config")
    public ResponseEntity<?> getConfig() {
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

    @PostMapping("/config")
    public ResponseEntity<?> saveConfig(@RequestBody Map<String, Object> payload) {
        Object coinsObj = payload.get("coinAmount");
        Object rupeesObj = payload.get("rupeeAmount");
        if (coinsObj == null || rupeesObj == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("coinAmount and rupeeAmount are required"));
        }
        int coins;
        double rupees;
        try {
            coins = Integer.parseInt(coinsObj.toString());
            rupees = Double.parseDouble(rupeesObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid values"));
        }
        if (coins <= 0 || rupees <= 0) {
            return ResponseEntity.badRequest().body(new MessageResponse("Values must be positive"));
        }
        WithdrawConfig config = withdrawConfigRepository.findTopByOrderByIdAsc()
                .orElseGet(WithdrawConfig::new);
        config.setCoinAmount(coins);
        config.setRupeeAmount(rupees);
        withdrawConfigRepository.save(config);
        Map<String, Object> response = new HashMap<>();
        response.put("coinAmount", config.getCoinAmount());
        response.put("rupeeAmount", config.getRupeeAmount());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> handleWithdrawAction(@RequestBody Map<String, Object> payload) {
        Object idObj = payload.get("withdrawId");
        Object actionObj = payload.get("action");
        if (idObj == null || actionObj == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("withdrawId and action are required"));
        }

        Long id;
        try {
            id = Long.parseLong(idObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid withdrawId"));
        }

        String action = actionObj.toString();

        WithdrawRequest request = withdrawRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Withdraw request not found"));

        if ("edit".equalsIgnoreCase(action)) {
            Object nameObj = payload.get("accountHolderName");
            Object bankNameObj = payload.get("bankName");
            Object accountNumberObj = payload.get("accountNumber");
            Object ifscCodeObj = payload.get("ifscCode");
            Object branchNameObj = payload.get("branchName");
            if (nameObj != null) {
                request.setAccountHolderName(nameObj.toString());
            }
            if (bankNameObj != null) {
                request.setBankName(bankNameObj.toString());
            }
            if (accountNumberObj != null) {
                request.setAccountNumber(accountNumberObj.toString());
            }
            if (ifscCodeObj != null) {
                request.setIfscCode(ifscCodeObj.toString());
            }
            if (branchNameObj != null) {
                request.setBranchName(branchNameObj.toString());
            }
            withdrawRequestRepository.save(request);
            return ResponseEntity.ok(new MessageResponse("Withdraw request updated"));
        }

        if ("approve".equalsIgnoreCase(action)) {
            if (request.getStatus() != WithdrawRequest.WithdrawStatus.PENDING) {
                return ResponseEntity.badRequest().body(new MessageResponse("Withdraw already processed"));
            }
            request.setStatus(WithdrawRequest.WithdrawStatus.APPROVED);
            withdrawRequestRepository.save(request);
            return ResponseEntity.ok(new MessageResponse("Withdraw approved"));
        }

        if ("decline".equalsIgnoreCase(action)) {
            if (request.getStatus() == WithdrawRequest.WithdrawStatus.PAID
                    || request.getStatus() == WithdrawRequest.WithdrawStatus.DECLINED) {
                return ResponseEntity.badRequest().body(new MessageResponse("Withdraw already finalized"));
            }
            request.setStatus(WithdrawRequest.WithdrawStatus.DECLINED);
            withdrawRequestRepository.save(request);

            Wallet wallet = walletRepository.findByUserId(request.getUserId())
                    .orElseGet(() -> {
                        Wallet w = new Wallet();
                        w.setUserId(request.getUserId());
                        return walletRepository.save(w);
                    });
            double balance = wallet.getBalance() != null ? wallet.getBalance() : 0.0;
            double coinsToRefund = request.getCoinAmount() != null ? request.getCoinAmount() : 0.0;
            wallet.setBalance(balance + coinsToRefund);
            walletRepository.save(wallet);

            WalletTransaction tx = new WalletTransaction();
            tx.setUserId(request.getUserId());
            tx.setAmount(coinsToRefund);
            tx.setCredit(true);
            tx.setType("WITHDRAW_REVERT");
            tx.setNote("Withdraw request declined");
            walletTransactionRepository.save(tx);

            return ResponseEntity.ok(new MessageResponse("Withdraw declined and amount refunded"));
        }

        if ("paid".equalsIgnoreCase(action)) {
            if (request.getStatus() != WithdrawRequest.WithdrawStatus.APPROVED) {
                return ResponseEntity.badRequest().body(new MessageResponse("Withdraw must be approved before marking paid"));
            }
            request.setStatus(WithdrawRequest.WithdrawStatus.PAID);
            withdrawRequestRepository.save(request);

            double coins = request.getCoinAmount() != null ? request.getCoinAmount() : 0.0;
            walletTransactionRepository.findFirstByUserIdAndTypeAndAmountOrderByCreatedAtDesc(
                            request.getUserId(),
                            "WITHDRAW_REQUEST",
                            coins
                    )
                    .ifPresent(tx -> {
                        tx.setType("WITHDRAW_PAID");
                        tx.setNote("Withdraw paid");
                        walletTransactionRepository.save(tx);
                    });

            return ResponseEntity.ok(new MessageResponse("Withdraw marked as paid"));
        }

        return ResponseEntity.badRequest().body(new MessageResponse("Unknown action"));
    }
}
