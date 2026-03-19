package com.ananta.admin.repository;

import com.ananta.admin.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Query(value = "SELECT * FROM chat_messages WHERE thread_id = :threadId AND deleted_at IS NULL ORDER BY created_at ASC", nativeQuery = true)
    List<ChatMessage> findByThreadIdOrderByCreatedAtAsc(@Param("threadId") String threadId);

    @Query(value = "SELECT COUNT(*) FROM chat_messages WHERE thread_id = :threadId", nativeQuery = true)
    long countByThreadId(@Param("threadId") String threadId);

    List<ChatMessage> findByThreadIdAndReceiverIdAndStatusNot(String threadId, String receiverId, String status);
}

