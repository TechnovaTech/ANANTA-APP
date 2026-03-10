package com.ananta.admin.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_settings")
public class AppSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "signup_bonus", nullable = false)
    private Integer signupBonus = 0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSignupBonus() {
        return signupBonus;
    }

    public void setSignupBonus(Integer signupBonus) {
        this.signupBonus = signupBonus;
    }
}
