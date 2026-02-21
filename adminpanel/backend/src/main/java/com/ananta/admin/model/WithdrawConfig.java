package com.ananta.admin.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "withdraw_config")
public class WithdrawConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coin_amount", nullable = false)
    private Integer coinAmount;

    @Column(name = "rupee_amount", nullable = false)
    private Double rupeeAmount;
}

