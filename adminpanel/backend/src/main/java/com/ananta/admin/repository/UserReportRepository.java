package com.ananta.admin.repository;

import com.ananta.admin.model.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserReportRepository extends JpaRepository<UserReport, Long> {
    List<UserReport> findByReportedUserId(String reportedUserId);
    List<UserReport> findByStatus(String status);
    List<UserReport> findAllByOrderByCreatedAtDesc();
}
