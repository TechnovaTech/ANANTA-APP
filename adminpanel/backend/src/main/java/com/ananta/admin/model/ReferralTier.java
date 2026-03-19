package com.ananta.admin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "referral_tiers")
public class ReferralTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "shares", nullable = false, unique = true)
    private Integer shares;

    @Column(name = "coins", nullable = false)
    private Integer coins;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getShares() { return shares; }
    public void setShares(Integer shares) { this.shares = shares; }

    public Integer getCoins() { return coins; }
    public void setCoins(Integer coins) { this.coins = coins; }
}
