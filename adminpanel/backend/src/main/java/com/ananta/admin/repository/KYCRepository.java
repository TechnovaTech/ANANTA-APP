package com.ananta.admin.repository;

import com.ananta.admin.model.KYC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface KYCRepository extends JpaRepository<KYC, Long> {
    Optional<KYC> findByUserId(String userId);
    @Query("select k from KYC k where trim(k.userId) = :userId")
    Optional<KYC> findByUserIdTrimmed(@Param("userId") String userId);
    @Query(value = "select * from kyc_records where upper(regexp_replace(user_id, '[^A-Za-z0-9]', '', 'g')) = upper(:userId)", nativeQuery = true)
    Optional<KYC> findByUserIdNormalized(@Param("userId") String userId);
    @Query(value = "select * from kyc_records where upper(regexp_replace(user_id, '[^A-Za-z0-9]', '', 'g')) like '%' || upper(:userId) || '%' limit 1", nativeQuery = true)
    Optional<KYC> findFirstByUserIdLikeNormalized(@Param("userId") String userId);
    Optional<KYC> findByFullName(String fullName);
}
