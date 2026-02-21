package com.ananta.admin.repository;

import com.ananta.admin.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByThreadIdOrderByCreatedAtAsc(String threadId);

    long countByThreadId(String threadId);

    List<ChatMessage> findByThreadIdAndReceiverIdAndStatusNot(String threadId, String receiverId, String status);
}

