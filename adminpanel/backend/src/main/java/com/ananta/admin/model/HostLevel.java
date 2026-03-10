package com.ananta.admin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "host_levels")
public class HostLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "level", nullable = false, unique = true)
    private Integer level;

    @Column(name = "coins_required", nullable = false)
    private Integer coinsRequired;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getCoinsRequired() {
        return coinsRequired;
    }

    public void setCoinsRequired(Integer coinsRequired) {
        this.coinsRequired = coinsRequired;
    }
}
