package com.amo11k.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameDetailResponse {
    private String title;
    private String coverUrl;
    private String releaseDate;
    private String genres;
    private String platforms;
    private String description;
    private Double rawgRating;
    private Integer metacritic;
    private String externalId;
}
