package com.ananta.admin.repository;

import com.ananta.admin.model.LiveSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LiveSessionRepository extends JpaRepository<LiveSession, Long> {
    Optional<LiveSession> findBySessionId(String sessionId);
    List<LiveSession> findByStatus(String status);
    List<LiveSession> findByStatusIgnoreCase(String status);
    List<LiveSession> findByHostUserIdOrderByCreatedAtDesc(String hostUserId);
}
