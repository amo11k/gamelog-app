package com.amo11k.backend.mapper;

import com.amo11k.backend.dto.response.UserProfileResponse;
import com.amo11k.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "gamesCount", ignore = true)
    @Mapping(target = "completedGames", ignore = true)
    @Mapping(target = "totalHours", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    UserProfileResponse toProfileResponse(User user);

    default UserProfileResponse toProfileResponseWithStats(
            User user, long gamesCount, long completedGames,
            double totalHours, double averageRating) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .gamesCount(gamesCount)
                .completedGames(completedGames)
                .totalHours(totalHours)
                .averageRating(averageRating)
                .build();
    }
}
