package com.amo11k.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameResponse {
    private Long id;
    private String externalId;
    private String title;
    private String coverUrl;
    private String releaseDate;
    private String genres;
    private String platforms;
}
