package com.ananta.admin.controller;

import com.ananta.admin.model.HeroItem;
import com.ananta.admin.repository.HeroItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(
        origins = {
                "http://localhost:8081",
                "http://localhost:19006",
                "http://localhost:3000"
        },
        maxAge = 3600
)
@RestController
@RequestMapping("/api/admin/hero")
public class AdminHeroController {

    private static final String UPLOAD_DIR = Paths.get(System.getProperty("user.dir"))
            .getParent()
            .resolve("public")
            .resolve("uploads")
            .toString();

    @Autowired
    private HeroItemRepository heroItemRepository;

    @GetMapping
    public ResponseEntity<?> getHeroes() {
        List<HeroItem> items = heroItemRepository.findAllByOrderBySortOrderAscCreatedAtDesc();
        Map<String, Object> response = new HashMap<>();
        response.put("items", items);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createHero(@RequestBody HeroItem payload) {
        payload.setId(null);
        if (!StringUtils.hasText(payload.getMediaType())) {
            payload.setMediaType("IMAGE");
        }
        if (payload.getSortOrder() == null) {
            payload.setSortOrder(0);
        }
        HeroItem saved = heroItemRepository.save(payload);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHero(@PathVariable Long id, @RequestBody HeroItem payload) {
        HeroItem existing = heroItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hero item not found"));
        existing.setTitle(payload.getTitle());
        existing.setSubtitle(payload.getSubtitle());
        existing.setMediaUrl(payload.getMediaUrl());
        if (StringUtils.hasText(payload.getMediaType())) {
            existing.setMediaType(payload.getMediaType());
        }
        existing.setActive(payload.isActive());
        existing.setSortOrder(payload.getSortOrder() == null ? 0 : payload.getSortOrder());
        HeroItem saved = heroItemRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveHero(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "subtitle", required = false) String subtitle,
            @RequestParam(value = "mediaType", required = false) String mediaType,
            @RequestParam(value = "sortOrder", required = false) Integer sortOrder,
            @RequestParam(value = "active", required = false, defaultValue = "true") Boolean active,
            @RequestPart(value = "media", required = false) MultipartFile media
    ) {
        HeroItem item;
        if (id != null) {
            item = heroItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Hero item not found"));
        } else {
            item = new HeroItem();
        }

        item.setTitle(title);
        item.setSubtitle(subtitle);
        item.setActive(active != null && active);
        item.setSortOrder(sortOrder == null ? 0 : sortOrder);

        if (StringUtils.hasText(mediaType)) {
            item.setMediaType(mediaType);
        } else if (media != null && StringUtils.hasText(media.getContentType()) && media.getContentType().startsWith("video")) {
            item.setMediaType("VIDEO");
        } else if (!StringUtils.hasText(item.getMediaType())) {
            item.setMediaType("IMAGE");
        }

        if (media != null && !media.isEmpty()) {
            String path = saveHeroMedia(media);
            if (StringUtils.hasText(path)) {
                item.setMediaUrl(path);
            }
        }

        HeroItem saved = heroItemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHero(@PathVariable Long id) {
        if (!heroItemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        heroItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private String saveHeroMedia(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Files.createDirectories(uploadPath);
            String original = file.getOriginalFilename();
            String ext = "";
            if (StringUtils.hasText(original) && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            } else {
                ext = ".jpg";
            }
            String filename = "hero_" + UUID.randomUUID() + "_" + System.currentTimeMillis() + ext;
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath.toFile());
            return "/uploads/" + filename;
        } catch (IOException e) {
            return null;
        }
    }
}
