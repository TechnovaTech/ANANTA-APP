package com.ananta.admin.repository;

import com.ananta.admin.model.ChatThread;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatThreadRepository extends JpaRepository<ChatThread, Long> {
    Optional<ChatThread> findByThreadId(String threadId);

    Optional<ChatThread> findByUserAIdAndUserBId(String userAId, String userBId);

    Optional<ChatThread> findByUserAIdAndUserBIdOrUserBIdAndUserAId(
            String userAId1, String userBId1, String userAId2, String userBId2
    );

    List<ChatThread> findByUserAIdOrUserBIdOrderByLastMessageTimeDesc(String userAId, String userBId);
}

