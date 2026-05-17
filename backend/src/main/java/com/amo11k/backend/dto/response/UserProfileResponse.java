package com.amo11k.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private String bio;
    private LocalDateTime createdAt;
    private long gamesCount;
    private long completedGames;
    private double totalHours;
    private double averageRating;
}
