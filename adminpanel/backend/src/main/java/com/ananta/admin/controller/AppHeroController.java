package com.ananta.admin.controller;

import com.ananta.admin.model.HeroItem;
import com.ananta.admin.repository.HeroItemRepository;
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
                "http://localhost:3000"
        },
        maxAge = 3600
)
@RestController
@RequestMapping("/api/app/hero")
public class AppHeroController {

    @Autowired
    private HeroItemRepository heroItemRepository;

    @GetMapping
    public ResponseEntity<?> getActiveHeroes() {
        List<HeroItem> items = heroItemRepository.findByActiveTrueOrderBySortOrderAscCreatedAtDesc();
        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        return ResponseEntity.ok(response);
    }
}
