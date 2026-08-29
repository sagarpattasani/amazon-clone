package com.amazonclone.service;

import com.amazonclone.dto.AuthDto;
import com.amazonclone.entity.OtpToken;
import com.amazonclone.entity.RefreshToken;
import com.amazonclone.entity.User;
import com.amazonclone.exception.GlobalExceptionHandler.*;
import com.amazonclone.repository.OtpTokenRepository;
import com.amazonclone.repository.RefreshTokenRepository;
import com.amazonclone.repository.UserRepository;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // ═══════════════════════════════════
    // REGISTER
    // ═══════════════════════════════════
    @Transactional
    public AuthDto.UserResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .authProvider(User.AuthProvider.LOCAL)
                .role(User.Role.CUSTOMER)
                .isVerified(false)
                .isActive(true)
                .build();

        user = userRepository.save(user);
        log.info("User registered: {}", user.getEmail());

        // Send verification OTP
        String otp = generateAndSaveOtp(user.getEmail(), OtpToken.OtpPurpose.EMAIL_VERIFY);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), otp);

        return mapToUserResponse(user);
    }

    // ═══════════════════════════════════
    // VERIFY EMAIL
    // ═══════════════════════════════════
    @Transactional
    public AuthDto.AuthResponse verifyEmail(AuthDto.VerifyEmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getIsVerified()) {
            throw new BadRequestException("Email already verified");
        }

        verifyOtp(request.getEmail(), request.getOtp(), OtpToken.OtpPurpose.EMAIL_VERIFY);

        user.setIsVerified(true);
        userRepository.save(user);
        log.info("Email verified: {}", user.getEmail());

        return generateAuthResponse(user);
    }

    // ═══════════════════════════════════
    // RESEND OTP
    // ═══════════════════════════════════
    @Transactional
    public void resendOtp(AuthDto.ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getIsVerified()) {
            throw new BadRequestException("Email already verified");
        }

        // Rate limit: max 3 per hour
        long recentCount = otpTokenRepository.countRecentOtps(
                request.getEmail(), OtpToken.OtpPurpose.EMAIL_VERIFY, LocalDateTime.now().minusHours(1));
        if (recentCount >= 3) {
            throw new RateLimitException("Too many OTP requests. Please try again later.");
        }

        String otp = generateAndSaveOtp(user.getEmail(), OtpToken.OtpPurpose.EMAIL_VERIFY);
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), otp);
    }

    // ═══════════════════════════════════
    // LOGIN
    // ═══════════════════════════════════
    @Transactional
    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        // Check account lock
        if (user.isAccountLocked()) {
            throw new UnauthorizedException("Account is locked. Please try again after 30 minutes.");
        }

        // Check verification
        if (!user.getIsVerified()) {
            throw new UnauthorizedException("Please verify your email first");
        }

        // Check active status
        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is suspended. Contact support.");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            // Increment failed attempts
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5) {
                user.setLockTime(LocalDateTime.now().plusMinutes(30));
                log.warn("Account locked due to failed attempts: {}", user.getEmail());
            }
            userRepository.save(user);
            throw new UnauthorizedException("Invalid credentials");
        }

        // Reset failed attempts on successful login
        user.setFailedLoginAttempts(0);
        user.setLockTime(null);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in: {}", user.getEmail());
        return generateAuthResponse(user);
    }

    // ═══════════════════════════════════
    // GOOGLE LOGIN
    // ═══════════════════════════════════
    @Transactional
    public AuthDto.AuthResponse googleLogin(AuthDto.GoogleLoginRequest request) {
        // In production, verify Firebase ID token here
        // For now, we simulate by extracting email from token
        // FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(request.getIdToken());

        // Simulated: decode token (in real app, use Firebase Admin SDK)
        String email = "google_user@gmail.com"; // placeholder
        String name = "Google User";

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .authProvider(User.AuthProvider.GOOGLE)
                    .role(User.Role.CUSTOMER)
                    .isVerified(true)
                    .isActive(true)
                    .build();
            user = userRepository.save(user);
            log.info("New Google user registered: {}", email);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return generateAuthResponse(user);
    }

    // ═══════════════════════════════════
    // PHONE LOGIN - SEND OTP
    // ═══════════════════════════════════
    @Transactional
    public void sendPhoneOtp(AuthDto.PhoneSendOtpRequest request) {
        long recentCount = otpTokenRepository.countRecentOtps(
                request.getPhone(), OtpToken.OtpPurpose.LOGIN, LocalDateTime.now().minusHours(1));
        if (recentCount >= 3) {
            throw new RateLimitException("Too many OTP requests. Please try again later.");
        }

        String otp = generateAndSaveOtp(request.getPhone(), OtpToken.OtpPurpose.LOGIN);
        // In production, send SMS via Twilio/Firebase
        log.info("Phone OTP for {}: {}", request.getPhone(), otp);
    }

    // ═══════════════════════════════════
    // PHONE LOGIN - VERIFY OTP
    // ═══════════════════════════════════
    @Transactional
    public AuthDto.AuthResponse verifyPhoneOtp(AuthDto.PhoneVerifyOtpRequest request) {
        verifyOtp(request.getPhone(), request.getOtp(), OtpToken.OtpPurpose.LOGIN);

        User user = userRepository.findByPhone(request.getPhone()).orElse(null);

        if (user == null) {
            user = User.builder()
                    .name("User")
                    .email(request.getPhone() + "@phone.amazonclone.com")
                    .phone(request.getPhone())
                    .authProvider(User.AuthProvider.PHONE)
                    .role(User.Role.CUSTOMER)
                    .isVerified(true)
                    .isPhoneVerified(true)
                    .isActive(true)
                    .build();
            user = userRepository.save(user);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return generateAuthResponse(user);
    }

    // ═══════════════════════════════════
    // FORGOT PASSWORD
    // ═══════════════════════════════════
    @Transactional
    public void forgotPassword(AuthDto.ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with this email"));

        String resetToken = UUID.randomUUID().toString();
        OtpToken otpToken = OtpToken.builder()
                .identifier(request.getEmail())
                .otpHash(passwordEncoder.encode(resetToken))
                .purpose(OtpToken.OtpPurpose.PASSWORD_RESET)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
        otpTokenRepository.save(otpToken);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetToken);
        log.info("Password reset email sent to: {}", request.getEmail());
    }

    // ═══════════════════════════════════
    // RESET PASSWORD
    // ═══════════════════════════════════
    @Transactional
    public void resetPassword(AuthDto.ResetPasswordRequest request) {
        OtpToken otpToken = otpTokenRepository
                .findTopByIdentifierAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(
                        null, OtpToken.OtpPurpose.PASSWORD_RESET)
                .orElse(null);

        // Find all unused password reset tokens and verify
        boolean tokenValid = false;
        String userEmail = null;

        var allTokens = otpTokenRepository.findAll().stream()
                .filter(t -> t.getPurpose() == OtpToken.OtpPurpose.PASSWORD_RESET && !t.getIsUsed() && !t.isExpired())
                .toList();

        for (OtpToken token : allTokens) {
            if (passwordEncoder.matches(request.getToken(), token.getOtpHash())) {
                tokenValid = true;
                userEmail = token.getIdentifier();
                token.setIsUsed(true);
                otpTokenRepository.save(token);
                break;
            }
        }

        if (!tokenValid) {
            throw new BadRequestException("Invalid or expired reset token");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Revoke all refresh tokens
        refreshTokenRepository.revokeAllByUserId(user.getId());

        emailService.sendPasswordChangedEmail(user.getEmail(), user.getName());
        log.info("Password reset for: {}", userEmail);
    }

    // ═══════════════════════════════════
    // REFRESH TOKEN
    // ═══════════════════════════════════
    @Transactional
    public AuthDto.AuthResponse refreshToken(AuthDto.RefreshTokenRequest request) {
        String tokenHash = passwordEncoder.encode(request.getRefreshToken());

        // Find the refresh token
        var allTokens = refreshTokenRepository.findAll().stream()
                .filter(t -> !t.getIsRevoked() && !t.isExpired())
                .toList();

        RefreshToken refreshToken = null;
        for (RefreshToken rt : allTokens) {
            if (passwordEncoder.matches(request.getRefreshToken(), rt.getTokenHash())) {
                refreshToken = rt;
                break;
            }
        }

        if (refreshToken == null) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        User user = refreshToken.getUser();
        // Revoke old token
        refreshToken.setIsRevoked(true);
        refreshTokenRepository.save(refreshToken);

        return generateAuthResponse(user);
    }

    // ═══════════════════════════════════
    // LOGOUT
    // ═══════════════════════════════════
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        log.info("User logged out: {}", userId);
    }

    // ═══════════════════════════════════
    // GET CURRENT USER
    // ═══════════════════════════════════
    public AuthDto.UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    // ═══════════════════════════════════
    // HELPER METHODS
    // ═══════════════════════════════════
    private String generateAndSaveOtp(String identifier, OtpToken.OtpPurpose purpose) {
        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpToken otpToken = OtpToken.builder()
                .identifier(identifier)
                .otpHash(passwordEncoder.encode(otp))
                .purpose(purpose)
                .expiresAt(LocalDateTime.now().plusMinutes(purpose == OtpToken.OtpPurpose.LOGIN ? 5 : 10))
                .build();
        otpTokenRepository.save(otpToken);

        return otp;
    }

    private void verifyOtp(String identifier, String otp, OtpToken.OtpPurpose purpose) {
        OtpToken otpToken = otpTokenRepository
                .findTopByIdentifierAndPurposeAndIsUsedFalseOrderByCreatedAtDesc(identifier, purpose)
                .orElseThrow(() -> new BadRequestException("No OTP found. Please request a new one."));

        if (otpToken.isExpired()) {
            throw new BadRequestException("OTP has expired. Please request a new one.");
        }

        otpToken.setAttempts(otpToken.getAttempts() + 1);
        if (otpToken.getAttempts() > 5) {
            otpToken.setIsUsed(true);
            otpTokenRepository.save(otpToken);
            throw new RateLimitException("Too many attempts. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(otp, otpToken.getOtpHash())) {
            otpTokenRepository.save(otpToken);
            throw new BadRequestException("Invalid OTP");
        }

        otpToken.setIsUsed(true);
        otpTokenRepository.save(otpToken);
    }

    private AuthDto.AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), user.getRole().name());
        String rawRefreshToken = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(passwordEncoder.encode(rawRefreshToken))
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthDto.AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration())
                .user(mapToUserResponse(user))
                .build();
    }

    private AuthDto.UserResponse mapToUserResponse(User user) {
        return AuthDto.UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profilePic(user.getProfilePic())
                .role(user.getRole().name())
                .authProvider(user.getAuthProvider().name())
                .isVerified(user.getIsVerified())
                .isPhoneVerified(user.getIsPhoneVerified())
                .build();
    }
}
