package com.amo11k.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamePriceResponse {
    private String title;
    private Double cheapestPrice;
    private String storeName;
    private String dealUrl;
}
