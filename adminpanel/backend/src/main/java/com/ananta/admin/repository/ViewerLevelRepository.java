package com.ananta.admin.repository;

import com.ananta.admin.model.ViewerLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViewerLevelRepository extends JpaRepository<ViewerLevel, Long> {
    List<ViewerLevel> findAllByOrderByLevelAsc();
}
