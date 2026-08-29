package com.amazonclone.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class AuthDto {

    // ═══ Registration ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100)
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$", message = "Invalid phone number")
        private String phone;

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100)
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
                message = "Password must have at least 8 chars, 1 uppercase, 1 number, 1 special char")
        private String password;
    }

    // ═══ Login ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    // ═══ Auth Response ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType;
        private Long expiresIn;
        private UserResponse user;
    }

    // ═══ User Info Response ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String profilePic;
        private String role;
        private String authProvider;
        private Boolean isVerified;
        private Boolean isPhoneVerified;
    }

    // ═══ Email Verification ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class VerifyEmailRequest {
        @NotBlank private String email;
        @NotBlank @Size(min = 6, max = 6) private String otp;
    }

    // ═══ Resend OTP ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ResendOtpRequest {
        @NotBlank @Email private String email;
    }

    // ═══ Google Login ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class GoogleLoginRequest {
        @NotBlank private String idToken;
    }

    // ═══ Phone OTP ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class PhoneSendOtpRequest {
        @NotBlank private String phone;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class PhoneVerifyOtpRequest {
        @NotBlank private String phone;
        @NotBlank @Size(min = 6, max = 6) private String otp;
    }

    // ═══ Forgot / Reset Password ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ForgotPasswordRequest {
        @NotBlank @Email private String email;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ResetPasswordRequest {
        @NotBlank private String token;
        @NotBlank @Size(min = 8)
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")
        private String newPassword;
    }

    // ═══ Refresh Token ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class RefreshTokenRequest {
        @NotBlank private String refreshToken;
    }

    // ═══ Change Password ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ChangePasswordRequest {
        @NotBlank private String currentPassword;
        @NotBlank @Size(min = 8)
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")
        private String newPassword;
    }

    // ═══ Update Profile ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class UpdateProfileRequest {
        @Size(min = 2, max = 100) private String name;
        @Pattern(regexp = "^\\+?[1-9]\\d{9,14}$") private String phone;
        private String profilePic;
    }
}
