package com.ananta.admin.controller;

import com.ananta.admin.model.Gift;
import com.ananta.admin.repository.GiftRepository;
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
@RequestMapping("/api/admin/gifts")
public class AdminGiftController {

    private static final String UPLOAD_DIR = Paths.get(System.getProperty("user.dir"))
            .getParent()
            .resolve("public")
            .resolve("uploads")
            .toString();

    @Autowired
    private GiftRepository giftRepository;

    @GetMapping
    public ResponseEntity<?> getGifts() {
        List<Gift> gifts = giftRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("gifts", gifts);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createGift(@RequestBody Gift payload) {
        payload.setId(null);
        if (payload.getCoinValue() == null || payload.getCoinValue() < 0) {
            payload.setCoinValue(0);
        }
        Gift saved = giftRepository.save(payload);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGift(@PathVariable Long id, @RequestBody Gift payload) {
        Gift existing = giftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gift not found"));
        existing.setName(payload.getName());
        existing.setCoinValue(payload.getCoinValue());
        existing.setImageUrl(payload.getImageUrl());
        existing.setActive(payload.isActive());
        Gift saved = giftRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveGift(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam("name") String name,
            @RequestParam("coinValue") Integer coinValue,
            @RequestParam(value = "active", required = false, defaultValue = "true") Boolean active,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        Gift gift;
        if (id != null) {
            gift = giftRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Gift not found"));
        } else {
            gift = new Gift();
        }

        gift.setName(name);
        if (coinValue == null || coinValue < 0) {
            gift.setCoinValue(0);
        } else {
            gift.setCoinValue(coinValue);
        }
        gift.setActive(active != null && active);

        if (image != null && !image.isEmpty()) {
            String path = saveGiftImage(image);
            if (StringUtils.hasText(path)) {
                gift.setImageUrl(path);
            }
        }

        Gift saved = giftRepository.save(gift);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGift(@PathVariable Long id) {
        if (!giftRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        giftRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    private String saveGiftImage(MultipartFile file) {
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
            String filename = "gift_" + UUID.randomUUID() + "_" + System.currentTimeMillis() + ext;
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath.toFile());
            return "/uploads/" + filename;
        } catch (IOException e) {
            return null;
        }
    }
}
