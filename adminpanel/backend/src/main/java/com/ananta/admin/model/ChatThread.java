package com.ananta.admin.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chat_threads")
public class ChatThread {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "thread_id", unique = true, nullable = false)
    private String threadId;

    @Column(name = "user_a_id", nullable = false)
    private String userAId;

    @Column(name = "user_b_id", nullable = false)
    private String userBId;

    @Column(name = "last_message_text")
    private String lastMessageText;

    @Column(name = "last_message_time")
    private LocalDateTime lastMessageTime;

    @Column(name = "last_message_sender_id")
    private String lastMessageSenderId;

    @Column(name = "unread_count_a")
    private Integer unreadCountA = 0;

    @Column(name = "unread_count_b")
    private Integer unreadCountB = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

