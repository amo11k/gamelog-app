package com.amo11k.backend.service;

import com.amo11k.backend.dto.request.UpdateUserGameRequest;
import com.amo11k.backend.dto.request.UserGameRequest;
import com.amo11k.backend.dto.response.GameResponse;
import com.amo11k.backend.dto.response.UserGameResponse;
import com.amo11k.backend.entity.Game;
import com.amo11k.backend.entity.User;
import com.amo11k.backend.entity.UserGame;
import com.amo11k.backend.entity.enums.GameStatus;
import com.amo11k.backend.exception.BadRequestException;
import com.amo11k.backend.exception.ResourceNotFoundException;
import com.amo11k.backend.mapper.UserGameMapper;
import com.amo11k.backend.repository.UserGameRepository;
import com.amo11k.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserGameService {

    private final UserGameRepository userGameRepository;
    private final UserRepository userRepository;
    private final GameService gameService;
    private final UserGameMapper userGameMapper;

    public List<UserGameResponse> getUserGames(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<UserGame> userGames;
        if (status != null && !status.isEmpty()) {
            GameStatus gameStatus = GameStatus.valueOf(status.toUpperCase());
            userGames = userGameRepository.findByUserIdAndStatus(userId, gameStatus);
        } else {
            userGames = userGameRepository.findByUserId(userId);
        }

        return userGames.stream()
                .map(userGameMapper::toResponse)
                .toList();
    }

    @Transactional
    public UserGameResponse addGame(Long userId, UserGameRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Game game;
        if (request.getGameId() != null) {
            game = gameService.getOrCreateGame(
                    GameResponse.builder().id(request.getGameId()).build());
        } else if (request.getExternalGameId() != null) {
            game = gameService.getOrCreateGame(
                    GameResponse.builder()
                            .externalId(request.getExternalGameId())
                            .title(request.getTitle())
                            .coverUrl(request.getCoverUrl())
                            .releaseDate(request.getReleaseDate())
                            .genres(request.getGenres())
                            .platforms(request.getPlatforms())
                            .build());
        } else {
            throw new BadRequestException("Game ID or external game ID is required");
        }

        if (userGameRepository.existsByUserIdAndGameId(userId, game.getId())) {
            throw new BadRequestException("Game already in your collection");
        }

        UserGame userGame = UserGame.builder()
                .user(user)
                .game(game)
                .status(request.getStatus())
                .rating(request.getRating() != null ? request.getRating() : 0)
                .hoursPlayed(request.getHoursPlayed())
                .review(request.getReview())
                .build();

        if (request.getStatus() == GameStatus.COMPLETED) {
            userGame.setCompletedAt(LocalDateTime.now());
        }

        userGame = userGameRepository.save(userGame);
        return userGameMapper.toResponse(userGame);
    }

    @Transactional
    public UserGameResponse updateGame(Long userGameId, Long userId, UpdateUserGameRequest request) {
        UserGame userGame = userGameRepository.findById(userGameId)
                .orElseThrow(() -> new ResourceNotFoundException("UserGame not found"));

        if (!userGame.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only update your own games");
        }

        if (request.getStatus() != null) {
            GameStatus current = userGame.getStatus();
            GameStatus requested = request.getStatus();

            if (current == GameStatus.COMPLETED || current == GameStatus.WISHLIST) {
                throw new BadRequestException("Cannot change status of " + current.name().toLowerCase() + " games");
            }

            if (current == GameStatus.PLAYING && requested != GameStatus.COMPLETED && requested != GameStatus.DROPPED) {
                throw new BadRequestException("Playing games can only change to completed or dropped");
            }

            if (current == GameStatus.DROPPED && requested != GameStatus.COMPLETED && requested != GameStatus.PLAYING) {
                throw new BadRequestException("Dropped games can only change to completed or playing");
            }

            userGame.setStatus(requested);
            if (requested == GameStatus.COMPLETED && userGame.getCompletedAt() == null) {
                userGame.setCompletedAt(LocalDateTime.now());
            }
        }
        if (request.getRating() != null) {
            if (request.getRating() < 0 || request.getRating() > 100) {
                throw new BadRequestException("Rating must be between 0 and 100");
            }
            userGame.setRating(request.getRating());
        }
        if (request.getHoursPlayed() != null) {
            if (request.getHoursPlayed() < 0) {
                throw new BadRequestException("Hours played cannot be negative");
            }
            userGame.setHoursPlayed(request.getHoursPlayed());
        }
        if (request.getReview() != null) {
            if (request.getReview().length() > 140) {
                throw new BadRequestException("Review must be at most 140 characters");
            }
            userGame.setReview(request.getReview());
        }

        userGame = userGameRepository.save(userGame);
        return userGameMapper.toResponse(userGame);
    }

    @Transactional
    public void removeGame(Long userGameId, Long userId) {
        UserGame userGame = userGameRepository.findById(userGameId)
                .orElseThrow(() -> new ResourceNotFoundException("UserGame not found"));

        if (!userGame.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only remove your own games");
        }

        userGameRepository.delete(userGame);
    }
}
