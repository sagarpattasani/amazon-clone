package com.amazonclone.service;

import com.amazonclone.dto.AuthDto;
import com.amazonclone.entity.User;
import com.amazonclone.repository.UserRepository;
import com.amazonclone.security.JwtTokenProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    /**
     * Verify Google ID token and login/register the user.
     * Frontend sends the ID token obtained from Google Sign-In.
     */
    @Transactional
    public AuthDto.AuthResponse loginWithGoogle(String idTokenString) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new RuntimeException("Google OAuth is not configured. Please set GOOGLE_CLIENT_ID in .env");
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new RuntimeException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            boolean emailVerified = Boolean.TRUE.equals(payload.getEmailVerified());

            if (!emailVerified) {
                throw new RuntimeException("Google email is not verified");
            }

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        // Create new user from Google info
                        User newUser = User.builder()
                                .name(name != null ? name : email.split("@")[0])
                                .email(email)
                                .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                                .isVerified(true)
                                .isActive(true)
                                .role(User.Role.CUSTOMER)
                                .profilePic(pictureUrl)
                                .authProvider(User.AuthProvider.GOOGLE)
                                .build();
                        return userRepository.save(newUser);
                    });

            // If existing user logged in with email before, mark as also Google-linked
            if (user.getAuthProvider() == null || user.getAuthProvider() == User.AuthProvider.LOCAL) {
                user.setAuthProvider(User.AuthProvider.GOOGLE);
                if (pictureUrl != null && user.getProfilePic() == null) {
                    user.setProfilePic(pictureUrl);
                }
                user.setIsVerified(true);
                userRepository.save(user);
            }

            // Generate JWT tokens
            String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

            AuthDto.UserResponse userResponse = AuthDto.UserResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .role(user.getRole().name())
                    .profilePic(user.getProfilePic())
                    .authProvider(user.getAuthProvider().name())
                    .isVerified(user.getIsVerified())
                    .build();

            log.info("Google OAuth login successful for: {}", email);

            return AuthDto.AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(userResponse)
                    .build();

        } catch (Exception e) {
            log.error("Google OAuth verification failed: {}", e.getMessage());
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}
