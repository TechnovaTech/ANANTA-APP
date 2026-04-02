package com.ananta.admin.controller;

import com.ananta.admin.model.HostLevel;
import com.ananta.admin.model.ViewerLevel;
import com.ananta.admin.repository.HostLevelRepository;
import com.ananta.admin.repository.ViewerLevelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(
        origins = {
                "http://localhost:8081",
                "http://localhost:19006",
                "http://localhost:3011"
        },
        maxAge = 3600
)
@RestController
@RequestMapping("/api/admin/levels")
public class AdminLevelManagementController {

    @Autowired
    private HostLevelRepository hostLevelRepository;

    @Autowired
    private ViewerLevelRepository viewerLevelRepository;

    @GetMapping("/host")
    public ResponseEntity<?> getHostLevels() {
        List<HostLevel> levels = hostLevelRepository.findAllByOrderByLevelAsc();
        Map<String, Object> response = new HashMap<>();
        response.put("levels", levels);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/host")
    public ResponseEntity<?> createHostLevel(@RequestBody HostLevel level) {
        level.setId(null);
        HostLevel saved = hostLevelRepository.save(level);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/host/{id}")
    public ResponseEntity<?> updateHostLevel(@PathVariable Long id, @RequestBody HostLevel payload) {
        HostLevel existing = hostLevelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Level not found"));
        existing.setLevel(payload.getLevel());
        existing.setCoinsRequired(payload.getCoinsRequired());
        HostLevel saved = hostLevelRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/host/{id}")
    public ResponseEntity<?> deleteHostLevel(@PathVariable Long id) {
        if (!hostLevelRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        hostLevelRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/viewer")
    public ResponseEntity<?> getViewerLevels() {
        List<ViewerLevel> levels = viewerLevelRepository.findAllByOrderByLevelAsc();
        Map<String, Object> response = new HashMap<>();
        response.put("levels", levels);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/viewer")
    public ResponseEntity<?> createViewerLevel(@RequestBody ViewerLevel level) {
        level.setId(null);
        ViewerLevel saved = viewerLevelRepository.save(level);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/viewer/{id}")
    public ResponseEntity<?> updateViewerLevel(@PathVariable Long id, @RequestBody ViewerLevel payload) {
        ViewerLevel existing = viewerLevelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Level not found"));
        existing.setLevel(payload.getLevel());
        existing.setCoinsRequired(payload.getCoinsRequired());
        ViewerLevel saved = viewerLevelRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/viewer/{id}")
    public ResponseEntity<?> deleteViewerLevel(@PathVariable Long id) {
        if (!viewerLevelRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        viewerLevelRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}