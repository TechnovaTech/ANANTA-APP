package com.ananta.admin.repository;

import com.ananta.admin.model.RechargePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RechargePlanRepository extends JpaRepository<RechargePlan, Long> {
    List<RechargePlan> findByActiveTrueOrderByPriceAsc();
}

