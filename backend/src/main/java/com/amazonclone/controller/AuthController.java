package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.AuthDto;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.service.AuthService;
import com.amazonclone.service.GoogleOAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final GoogleOAuthService googleOAuthService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse.Success<AuthDto.UserResponse>> register(
            @Valid @RequestBody AuthDto.RegisterRequest request) {
        AuthDto.UserResponse user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.Success.of(user, "Registration successful. Please check your email for verification OTP."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse.Success<AuthDto.AuthResponse>> verifyEmail(
            @Valid @RequestBody AuthDto.VerifyEmailRequest request) {
        AuthDto.AuthResponse response = authService.verifyEmail(request);
        return ResponseEntity.ok(ApiResponse.Success.of(response, "Email verified successfully"));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse.Success<Void>> resendOtp(
            @Valid @RequestBody AuthDto.ResendOtpRequest request) {
        authService.resendOtp(request);
        return ResponseEntity.ok(ApiResponse.Success.message("OTP sent successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse.Success<AuthDto.AuthResponse>> login(
            @Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.Success.of(response, "Login successful"));
    }

    @PostMapping("/google-login")
    public ResponseEntity<ApiResponse.Success<AuthDto.AuthResponse>> googleLogin(
            @Valid @RequestBody AuthDto.GoogleLoginRequest request) {
        AuthDto.AuthResponse response = authService.googleLogin(request);
        return ResponseEntity.ok(ApiResponse.Success.of(response, "Google login successful"));
    }

    @PostMapping("/phone-login/send-otp")
    public ResponseEntity<ApiResponse.Success<Void>> sendPhoneOtp(
            @Valid @RequestBody AuthDto.PhoneSendOtpRequest request) {
        authService.sendPhoneOtp(request);
        return ResponseEntity.ok(ApiResponse.Success.message("OTP sent to your phone"));
    }

    @PostMapping("/phone-login/verify-otp")
    public ResponseEntity<ApiResponse.Success<AuthDto.AuthResponse>> verifyPhoneOtp(
            @Valid @RequestBody AuthDto.PhoneVerifyOtpRequest request) {
        AuthDto.AuthResponse response = authService.verifyPhoneOtp(request);
        return ResponseEntity.ok(ApiResponse.Success.of(response, "Phone verified successfully"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse.Success<Void>> forgotPassword(
            @Valid @RequestBody AuthDto.ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.Success.message("Password reset link sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse.Success<Void>> resetPassword(
            @Valid @RequestBody AuthDto.ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.Success.message("Password reset successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse.Success<AuthDto.AuthResponse>> refreshToken(
            @Valid @RequestBody AuthDto.RefreshTokenRequest request) {
        AuthDto.AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.Success.of(response, "Token refreshed"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse.Success<Void>> logout(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        authService.logout(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.Success.message("Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse.Success<AuthDto.UserResponse>> getCurrentUser(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        AuthDto.UserResponse user = authService.getCurrentUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.Success.of(user));
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse.Success<AuthDto.AuthResponse>> googleLogin(
            @RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        if (idToken == null || idToken.isBlank()) {
            return ResponseEntity.badRequest().body(null);
        }
        AuthDto.AuthResponse response = googleOAuthService.loginWithGoogle(idToken);
        return ResponseEntity.ok(ApiResponse.Success.of(response, "Google login successful"));
    }
}
