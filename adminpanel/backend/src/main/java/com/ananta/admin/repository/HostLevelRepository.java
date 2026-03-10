package com.ananta.admin.repository;

import com.ananta.admin.model.HostLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostLevelRepository extends JpaRepository<HostLevel, Long> {
    List<HostLevel> findAllByOrderByLevelAsc();
}
