package com.amo11k.backend.repository;

import com.amo11k.backend.entity.UserGame;
import com.amo11k.backend.entity.enums.GameStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserGameRepository extends JpaRepository<UserGame, Long> {
    List<UserGame> findByUserId(Long userId);
    List<UserGame> findByUserIdAndStatus(Long userId, GameStatus status);
    Optional<UserGame> findByUserIdAndGameId(Long userId, Long gameId);
    boolean existsByUserIdAndGameId(Long userId, Long gameId);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, GameStatus status);
}
