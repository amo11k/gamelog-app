package com.amo11k.backend.dto.response;

import com.amo11k.backend.entity.enums.GameStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGameResponse {
    private Long id;
    private GameResponse game;
    private GameStatus status;
    private Integer rating;
    private Double hoursPlayed;
    private String review;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
}
