package com.amo11k.backend.service;

import com.amo11k.backend.dto.response.GameResponse;
import com.amo11k.backend.dto.response.PagedResponse;
import com.amo11k.backend.entity.Game;
import com.amo11k.backend.exception.BadRequestException;
import com.amo11k.backend.exception.ResourceNotFoundException;
import com.amo11k.backend.mapper.GameMapper;
import com.amo11k.backend.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final GameMapper gameMapper;
    private final RawgService rawgService;

    public PagedResponse<GameResponse> searchGames(String query, int page, int size) {
        if (query == null || query.trim().isEmpty()) {
            throw new BadRequestException("Search query is required");
        }

        List<Game> localResults = gameRepository.searchByTitle(query.trim());

        if (!localResults.isEmpty()) {
            List<GameResponse> responses = localResults.stream()
                    .map(gameMapper::toResponse)
                    .toList();
            return PagedResponse.<GameResponse>builder()
                    .data(responses)
                    .page(0)
                    .size(responses.size())
                    .totalElements(responses.size())
                    .totalPages(1)
                    .last(true)
                    .build();
        }

        List<GameResponse> rawgResults = rawgService.searchGames(query);
        return PagedResponse.<GameResponse>builder()
                .data(rawgResults)
                .page(0)
                .size(rawgResults.size())
                .totalElements(rawgResults.size())
                .totalPages(1)
                .last(true)
                .build();
    }

    @Transactional
    public GameResponse createGame(GameResponse request) {
        if (request.getExternalId() != null &&
                gameRepository.findByExternalId(request.getExternalId()).isPresent()) {
            Game existing = gameRepository.findByExternalId(request.getExternalId()).get();
            return gameMapper.toResponse(existing);
        }

        Game game = Game.builder()
                .externalId(request.getExternalId())
                .title(request.getTitle())
                .coverUrl(request.getCoverUrl())
                .releaseDate(request.getReleaseDate())
                .genres(request.getGenres())
                .platforms(request.getPlatforms())
                .build();

        game = gameRepository.save(game);
        return gameMapper.toResponse(game);
    }

    public Game getOrCreateGame(GameResponse gameDto) {
        if (gameDto.getId() != null) {
            return gameRepository.findById(gameDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Game not found"));
        }

        if (gameDto.getExternalId() != null) {
            return gameRepository.findByExternalId(gameDto.getExternalId())
                    .orElseGet(() -> {
                        Game game = Game.builder()
                                .externalId(gameDto.getExternalId())
                                .title(gameDto.getTitle())
                                .coverUrl(gameDto.getCoverUrl())
                                .releaseDate(gameDto.getReleaseDate())
                                .genres(gameDto.getGenres())
                                .platforms(gameDto.getPlatforms())
                                .build();
                        return gameRepository.save(game);
                    });
        }

        throw new BadRequestException("Game ID or external ID is required");
    }
}
