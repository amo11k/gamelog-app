package com.amo11k.backend.service;

import com.amo11k.backend.dto.response.GamePriceResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheapSharkService {

    private final RestTemplate restTemplate;

    @SuppressWarnings("unchecked")
    public GamePriceResponse getPrice(String title) {
        if (title == null || title.trim().isEmpty()) return null;

        String url = String.format("https://www.cheapshark.com/api/1.0/games?title=%s&limit=1", title.trim());

        try {
            List<Map<String, Object>> results = restTemplate.getForObject(url, List.class);
            if (results == null || results.isEmpty()) return null;

            Map<String, Object> game = results.get(0);
            String gameTitle = (String) game.get("external");
            String cheapest = (String) game.get("cheapest");
            String dealId = (String) game.get("cheapestDealID");

            Double price = null;
            if (cheapest != null) {
                try {
                    price = Double.parseDouble(cheapest);
                } catch (NumberFormatException e) {
                    log.warn("Failed to parse price: {}", cheapest);
                }
            }

            String storeName = null;
            String dealUrl = null;
            if (dealId != null) {
                String dealUrlStr = String.format("https://www.cheapshark.com/api/1.0/deals?id=%s", dealId);
                try {
                    Map<String, Object> deal = restTemplate.getForObject(dealUrlStr, Map.class);
                    if (deal != null) {
                        Object storeId = deal.get("storeID");
                        if (storeId != null) {
                            storeName = getStoreName(storeId.toString());
                        }
                        dealUrl = String.format("https://www.cheapshark.com/redirect?dealID=%s", dealId);
                    }
                } catch (Exception e) {
                    log.warn("Failed to fetch deal details for {}", dealId);
                }
            }

            return GamePriceResponse.builder()
                    .title(gameTitle)
                    .cheapestPrice(price)
                    .storeName(storeName)
                    .dealUrl(dealUrl)
                    .build();
        } catch (Exception e) {
            log.warn("Error fetching price from CheapShark: {}", e.getMessage());
            return null;
        }
    }

    private String getStoreName(String storeId) {
        return switch (storeId) {
            case "1" -> "Steam";
            case "2" -> "Gamersgate";
            case "3" -> "Green Man Gaming";
            case "4" -> "Amazon";
            case "5" -> "GameStop";
            case "6" -> "Direct2Drive";
            case "7" -> "GOG";
            case "8" -> "Origin";
            case "9" -> "Get Games";
            case "10" -> "Shiny Loot";
            case "11" -> "Humble Store";
            case "12" -> "Desura";
            case "13" -> "Ubisoft Store";
            case "14" -> "IndieGameStand";
            case "15" -> "Fanatical";
            case "16" -> "Gamesrocket";
            case "17" -> "Games Republic";
            case "18" -> "Sila Games";
            case "19" -> "Playfield";
            case "20" -> "Century Media";
            case "21" -> "2Game";
            case "22" -> "IndieGala";
            case "25" -> "Epic Games";
            default -> "Store " + storeId;
        };
    }
}
