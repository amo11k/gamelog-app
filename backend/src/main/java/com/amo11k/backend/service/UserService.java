package com.amo11k.backend.service;

import com.amo11k.backend.dto.request.UpdateProfileRequest;
import com.amo11k.backend.dto.response.UserProfileResponse;
import com.amo11k.backend.entity.User;
import com.amo11k.backend.entity.UserGame;
import com.amo11k.backend.entity.enums.GameStatus;
import com.amo11k.backend.exception.ResourceNotFoundException;
import com.amo11k.backend.mapper.UserMapper;
import com.amo11k.backend.repository.UserGameRepository;
import com.amo11k.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserGameRepository userGameRepository;
    private final UserMapper userMapper;

    public UserProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<UserGame> userGames = userGameRepository.findByUserId(user.getId());

        long gamesCount = userGames.size();
        long completedGames = userGames.stream()
                .filter(ug -> ug.getStatus() == GameStatus.COMPLETED)
                .count();
        double totalHours = userGames.stream()
                .filter(ug -> ug.getHoursPlayed() != null)
                .mapToDouble(UserGame::getHoursPlayed)
                .sum();
        double averageRating = userGames.stream()
                .filter(ug -> ug.getRating() != null && ug.getRating() > 0)
                .mapToInt(UserGame::getRating)
                .average()
                .orElse(0);

        return userMapper.toProfileResponseWithStats(
                user, gamesCount, completedGames, totalHours, averageRating);
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        user = userRepository.save(user);

        List<UserGame> userGames = userGameRepository.findByUserId(userId);
        long gamesCount = userGames.size();
        long completedGames = userGames.stream()
                .filter(ug -> ug.getStatus() == GameStatus.COMPLETED)
                .count();
        double totalHours = userGames.stream()
                .filter(ug -> ug.getHoursPlayed() != null)
                .mapToDouble(UserGame::getHoursPlayed)
                .sum();
        double averageRating = userGames.stream()
                .filter(ug -> ug.getRating() != null && ug.getRating() > 0)
                .mapToInt(UserGame::getRating)
                .average()
                .orElse(0);

        return userMapper.toProfileResponseWithStats(
                user, gamesCount, completedGames, totalHours, averageRating);
    }
}
