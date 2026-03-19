package com.ananta.admin.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_task_progress",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "task_id", "task_type"}))
public class UserTaskProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(name = "task_type", nullable = false)
    private String taskType; // "host" or "viewer"

    @Column(name = "current_value", nullable = false)
    private Double currentValue = 0.0;

    @Column(name = "completed", nullable = false)
    private Boolean completed = false;

    @Column(name = "reward_claimed", nullable = false)
    private Boolean rewardClaimed = false;

    @Column(name = "last_reset_date", nullable = false)
    private LocalDate lastResetDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }
    public Double getCurrentValue() { return currentValue; }
    public void setCurrentValue(Double currentValue) { this.currentValue = currentValue; }
    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
    public Boolean getRewardClaimed() { return rewardClaimed; }
    public void setRewardClaimed(Boolean rewardClaimed) { this.rewardClaimed = rewardClaimed; }
    public LocalDate getLastResetDate() { return lastResetDate; }
    public void setLastResetDate(LocalDate lastResetDate) { this.lastResetDate = lastResetDate; }
}
