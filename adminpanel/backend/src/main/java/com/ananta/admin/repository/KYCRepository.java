package com.ananta.admin.repository;

import com.ananta.admin.model.KYC;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KYCRepository extends JpaRepository<KYC, Long> {
    Optional<KYC> findByUserId(String userId);
}
