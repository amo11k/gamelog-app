package com.amo11k.backend.mapper;

import com.amo11k.backend.dto.response.UserGameResponse;
import com.amo11k.backend.entity.UserGame;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = GameMapper.class)
public interface UserGameMapper {

    @Mapping(source = "game", target = "game")
    UserGameResponse toResponse(UserGame userGame);
}
