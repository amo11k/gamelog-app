package com.amo11k.backend.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum GameStatus {
    PLAYING,
    COMPLETED,
    DROPPED,
    WISHLIST;

    @JsonValue
    public String toLower() {
        return name().toLowerCase();
    }
}
