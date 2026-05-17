package com.amo11k.backend.controller;

import com.amo11k.backend.dto.request.UpdateUserGameRequest;
import com.amo11k.backend.dto.request.UserGameRequest;
import com.amo11k.backend.dto.response.UserGameResponse;
import com.amo11k.backend.entity.User;
import com.amo11k.backend.exception.ResourceNotFoundException;
import com.amo11k.backend.repository.UserRepository;
import com.amo11k.backend.service.UserGameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-games")
@RequiredArgsConstructor
public class UserGameController {

    private final UserGameService userGameService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<List<UserGameResponse>> getUserGames(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status) {
        User user = getUserFromDetails(userDetails);
        List<UserGameResponse> games = userGameService.getUserGames(user.getId(), status);
        return ResponseEntity.ok(games);
    }

    @PostMapping
    public ResponseEntity<UserGameResponse> addGame(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserGameRequest request) {
        User user = getUserFromDetails(userDetails);
        UserGameResponse response = userGameService.addGame(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserGameResponse> updateGame(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserGameRequest request) {
        User user = getUserFromDetails(userDetails);
        UserGameResponse response = userGameService.updateGame(id, user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeGame(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        User user = getUserFromDetails(userDetails);
        userGameService.removeGame(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    private User getUserFromDetails(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
