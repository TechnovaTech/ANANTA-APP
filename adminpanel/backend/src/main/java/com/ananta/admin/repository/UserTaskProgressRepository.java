package com.ananta.admin.repository;

import com.ananta.admin.model.UserTaskProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserTaskProgressRepository extends JpaRepository<UserTaskProgress, Long> {
    Optional<UserTaskProgress> findByUserIdAndTaskIdAndTaskType(String userId, Long taskId, String taskType);
    List<UserTaskProgress> findByUserId(String userId);
}
