package com.ananta.admin.repository;

import com.ananta.admin.model.HeroItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HeroItemRepository extends JpaRepository<HeroItem, Long> {
    List<HeroItem> findByActiveTrueOrderBySortOrderAscCreatedAtDesc();
    List<HeroItem> findAllByOrderBySortOrderAscCreatedAtDesc();
}
