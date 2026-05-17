package com.amo11k.backend.controller;

import com.amo11k.backend.dto.response.GameDetailResponse;
import com.amo11k.backend.dto.response.GamePriceResponse;
import com.amo11k.backend.dto.response.GameResponse;
import com.amo11k.backend.dto.response.PagedResponse;
import com.amo11k.backend.service.CheapSharkService;
import com.amo11k.backend.service.GameService;
import com.amo11k.backend.service.RawgService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;
    private final CheapSharkService cheapSharkService;
    private final RawgService rawgService;

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<GameResponse>> searchGames(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<GameResponse> results = gameService.searchGames(q, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/price")
    public ResponseEntity<GamePriceResponse> getPrice(@RequestParam String q) {
        GamePriceResponse price = cheapSharkService.getPrice(q);
        if (price == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(price);
    }

    @GetMapping("/{externalId}/details")
    public ResponseEntity<GameDetailResponse> getGameDetails(@PathVariable String externalId) {
        GameDetailResponse details = rawgService.getGameDetails(externalId);
        if (details == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<GameResponse> createGame(@RequestBody GameResponse request) {
        GameResponse response = gameService.createGame(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
