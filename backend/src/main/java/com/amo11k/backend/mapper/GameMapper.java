package com.amo11k.backend.mapper;

import com.amo11k.backend.dto.response.GameResponse;
import com.amo11k.backend.entity.Game;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GameMapper {

    GameResponse toResponse(Game game);
}
