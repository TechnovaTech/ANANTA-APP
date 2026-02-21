package com.ananta.admin.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "wallet_transactions")
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "is_credit", nullable = false)
    private boolean credit;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(length = 255)
    private String note;

    @Column(name = "other_user_id")
    private String otherUserId;

    @Column(name = "other_user_name")
    private String otherUserName;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
