package com.ananta.admin.repository;

import com.ananta.admin.model.WithdrawRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WithdrawRequestRepository extends JpaRepository<WithdrawRequest, Long> {
    List<WithdrawRequest> findByUserIdOrderByCreatedAtDesc(String userId);
}

