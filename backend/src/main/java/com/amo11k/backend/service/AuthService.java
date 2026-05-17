package com.amo11k.backend.service;

import com.amo11k.backend.dto.request.LoginRequest;
import com.amo11k.backend.dto.request.RegisterRequest;
import com.amo11k.backend.dto.response.AuthResponse;
import com.amo11k.backend.dto.response.UserProfileResponse;
import com.amo11k.backend.entity.User;
import com.amo11k.backend.exception.BadRequestException;
import com.amo11k.backend.mapper.UserMapper;
import com.amo11k.backend.repository.UserRepository;
import com.amo11k.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);
        String token = tokenProvider.generateToken(user.getId(), user.getUsername());

        UserProfileResponse userResponse = userMapper.toProfileResponseWithStats(
                user, 0, 0, 0, 0);

        return AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        String token = tokenProvider.generateToken(user.getId(), user.getUsername());

        UserProfileResponse userResponse = userMapper.toProfileResponseWithStats(
                user, 0, 0, 0, 0);

        return AuthResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
    }
}
