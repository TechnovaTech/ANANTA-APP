package com.ananta.admin.repository;

import com.ananta.admin.model.WithdrawConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WithdrawConfigRepository extends JpaRepository<WithdrawConfig, Long> {
    Optional<WithdrawConfig> findTopByOrderByIdAsc();
}

