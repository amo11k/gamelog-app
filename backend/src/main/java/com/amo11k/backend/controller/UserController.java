package com.amo11k.backend.controller;

import com.amo11k.backend.dto.request.UpdateProfileRequest;
import com.amo11k.backend.dto.response.UserGameResponse;
import com.amo11k.backend.dto.response.UserProfileResponse;
import com.amo11k.backend.entity.User;
import com.amo11k.backend.exception.ResourceNotFoundException;
import com.amo11k.backend.repository.UserRepository;
import com.amo11k.backend.service.UserGameService;
import com.amo11k.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserGameService userGameService;
    private final UserRepository userRepository;

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable String username) {
        UserProfileResponse profile = userService.getProfile(username);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/{username}/games")
    public ResponseEntity<List<UserGameResponse>> getUserGames(
            @PathVariable String username,
            @RequestParam(required = false) String status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<UserGameResponse> games = userGameService.getUserGames(user.getId(), status);
        return ResponseEntity.ok(games);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserProfileResponse profile = userService.updateProfile(user.getId(), request);
        return ResponseEntity.ok(profile);
    }
}
