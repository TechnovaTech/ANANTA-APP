package com.ananta.admin.repository;

import com.ananta.admin.model.Gift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiftRepository extends JpaRepository<Gift, Long> {
    List<Gift> findByActiveTrueOrderByCoinValueAsc();
}

