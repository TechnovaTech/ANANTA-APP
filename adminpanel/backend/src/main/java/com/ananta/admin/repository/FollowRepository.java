package com.ananta.admin.repository;

import com.ananta.admin.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerIdAndFolloweeId(String followerId, String followeeId);
    void deleteByFollowerIdAndFolloweeId(String followerId, String followeeId);
    long countByFolloweeId(String followeeId);
    long countByFollowerId(String followerId);
    List<Follow> findByFolloweeId(String followeeId);
    List<Follow> findByFollowerId(String followerId);
}
