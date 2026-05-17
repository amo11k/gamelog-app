package com.amo11k.backend.dto.request;

import com.amo11k.backend.entity.enums.GameStatus;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserGameRequest {

    private Long gameId;

    private String externalGameId;

    private String title;

    private String coverUrl;

    private String releaseDate;

    private String genres;

    private String platforms;

    @NotNull(message = "Status is required")
    private GameStatus status;

    @Min(value = 0, message = "Rating must be between 0 and 100")
    @Max(value = 100, message = "Rating must be between 0 and 100")
    private Integer rating;

    @Min(value = 0, message = "Hours played cannot be negative")
    private Double hoursPlayed;

    @Size(max = 140, message = "Review must be at most 140 characters")
    private String review;
}
