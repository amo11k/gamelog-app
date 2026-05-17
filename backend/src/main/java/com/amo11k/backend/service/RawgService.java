package com.amo11k.backend.service;

import com.amo11k.backend.dto.response.GameDetailResponse;
import com.amo11k.backend.dto.response.GameResponse;
import com.amo11k.backend.entity.Game;
import com.amo11k.backend.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RawgService {

    private final RestTemplate restTemplate;

    @Value("${app.rawg.api-url}")
    private String apiUrl;

    @Value("${app.rawg.api-key}")
    private String apiKey;

    @SuppressWarnings("unchecked")
    public List<GameResponse> searchGames(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new BadRequestException("Search query is required");
        }

        String url = String.format("%s/games?key=%s&search=%s&page_size=20",
                apiUrl, apiKey, query.trim());

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null || !response.containsKey("results")) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            if (results == null) return Collections.emptyList();

            return results.stream()
                    .map(this::mapRawgResult)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching from RAWG API: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    @SuppressWarnings("unchecked")
    private GameResponse mapRawgResult(Map<String, Object> rawgGame) {
        try {
            Long id = rawgGame.get("id") instanceof Number
                    ? ((Number) rawgGame.get("id")).longValue()
                    : null;
            String title = (String) rawgGame.get("name");
            if (title == null) return null;

            String coverUrl = (String) rawgGame.get("background_image");

            String releaseDate = (String) rawgGame.get("released");

            String genres = null;
            List<Map<String, Object>> genreList = (List<Map<String, Object>>) rawgGame.get("genres");
            if (genreList != null) {
                genres = genreList.stream()
                        .map(g -> (String) g.get("name"))
                        .filter(Objects::nonNull)
                        .collect(Collectors.joining(", "));
            }

            String platforms = null;
            List<Map<String, Object>> platformList = (List<Map<String, Object>>) rawgGame.get("platforms");
            if (platformList != null) {
                platforms = platformList.stream()
                        .map(p -> {
                            Map<String, Object> platform = (Map<String, Object>) p.get("platform");
                            return platform != null ? (String) platform.get("name") : null;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.joining(", "));
            }

            return GameResponse.builder()
                    .externalId(id != null ? id.toString() : null)
                    .title(title)
                    .coverUrl(coverUrl)
                    .releaseDate(releaseDate)
                    .genres(genres)
                    .platforms(platforms)
                    .build();
        } catch (Exception e) {
            log.warn("Error mapping RAWG result: {}", e.getMessage());
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public GameDetailResponse getGameDetails(String externalId) {
        if (externalId == null || externalId.trim().isEmpty()) return null;

        String url = String.format("%s/games/%s?key=%s", apiUrl, externalId.trim(), apiKey);

        try {
            Map<String, Object> game = restTemplate.getForObject(url, Map.class);
            if (game == null) return null;

            String title = (String) game.get("name");
            String coverUrl = (String) game.get("background_image");
            String releaseDate = (String) game.get("released");
            String description = (String) game.get("description_raw");
            Number rawgRatingNum = (Number) game.get("rating");
            Number metacriticNum = (Number) game.get("metacritic");

            Double rawgRating = rawgRatingNum != null ? rawgRatingNum.doubleValue() : null;
            Integer metacritic = metacriticNum != null ? metacriticNum.intValue() : null;

            String genres = null;
            List<Map<String, Object>> genreList = (List<Map<String, Object>>) game.get("genres");
            if (genreList != null) {
                genres = genreList.stream()
                        .map(g -> (String) g.get("name"))
                        .filter(Objects::nonNull)
                        .collect(Collectors.joining(", "));
            }

            String platforms = null;
            List<Map<String, Object>> platformList = (List<Map<String, Object>>) game.get("platforms");
            if (platformList != null) {
                platforms = platformList.stream()
                        .map(p -> {
                            Map<String, Object> platform = (Map<String, Object>) p.get("platform");
                            return platform != null ? (String) platform.get("name") : null;
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.joining(", "));
            }

            return GameDetailResponse.builder()
                    .title(title)
                    .coverUrl(coverUrl)
                    .releaseDate(releaseDate)
                    .genres(genres)
                    .platforms(platforms)
                    .description(description)
                    .rawgRating(rawgRating)
                    .metacritic(metacritic)
                    .externalId(externalId)
                    .build();
        } catch (Exception e) {
            log.warn("Error fetching game details from RAWG: {}", e.getMessage());
            return null;
        }
    }
}
