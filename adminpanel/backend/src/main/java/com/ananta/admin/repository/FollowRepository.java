package com.ananta.admin.repository;

import com.ananta.admin.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerIdAndFolloweeId(String followerId, String followeeId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Follow f WHERE f.followerId = :followerId AND f.followeeId = :followeeId")
    void deleteByFollowerIdAndFolloweeId(@Param("followerId") String followerId, @Param("followeeId") String followeeId);
    long countByFolloweeId(String followeeId);
    long countByFollowerId(String followerId);
    List<Follow> findByFolloweeId(String followeeId);
    List<Follow> findByFollowerId(String followerId);
}
