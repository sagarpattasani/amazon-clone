package com.amazonclone.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@amazonclone.com}")
    private String fromEmail;

    @Value("${app.mail.from-name:Amazon Clone}")
    private String fromName;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    @Async
    public void sendVerificationEmail(String to, String name, String otp) {
        String subject = "Verify your Amazon Clone account";
        String html = buildEmailTemplate(name, 
            "Welcome to Amazon Clone!",
            "Thank you for registering. Use the OTP below to verify your email address:",
            "<div style='text-align:center;margin:30px 0;'>" +
            "<span style='font-size:32px;font-weight:bold;letter-spacing:8px;color:#FF9900;background:#232F3E;padding:15px 30px;border-radius:8px;'>" + otp + "</span>" +
            "</div>" +
            "<p style='color:#888;font-size:12px;'>This OTP is valid for 10 minutes.</p>"
        );
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendPasswordResetEmail(String to, String name, String resetToken) {
        String resetLink = baseUrl + "/reset-password?token=" + resetToken;
        String subject = "Reset your Amazon Clone password";
        String html = buildEmailTemplate(name,
            "Password Reset Request",
            "We received a request to reset your password. Click the button below to set a new password:",
            "<div style='text-align:center;margin:30px 0;'>" +
            "<a href='" + resetLink + "' style='background:#FF9900;color:#fff;padding:15px 40px;text-decoration:none;border-radius:4px;font-weight:bold;font-size:16px;'>Reset Password</a>" +
            "</div>" +
            "<p style='color:#888;font-size:12px;'>This link expires in 15 minutes. If you didn't request this, please ignore.</p>"
        );
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendPasswordChangedEmail(String to, String name) {
        String subject = "Your Amazon Clone password was changed";
        String html = buildEmailTemplate(name,
            "Password Changed Successfully",
            "Your password has been changed successfully. If you did not make this change, please contact support immediately.",
            ""
        );
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendOrderConfirmationEmail(String to, String name, String orderNumber, String orderTotal, String itemsHtml) {
        String subject = "Order Confirmed - " + orderNumber;
        String html = buildEmailTemplate(name,
            "Order Confirmed! 🎉",
            "Your order <strong>" + orderNumber + "</strong> has been placed successfully.",
            itemsHtml +
            "<div style='text-align:right;padding:15px;border-top:2px solid #FF9900;'>" +
            "<strong style='font-size:18px;'>Total: ₹" + orderTotal + "</strong></div>" +
            "<div style='text-align:center;margin:20px 0;'>" +
            "<a href='" + baseUrl + "/account/orders' style='background:#FF9900;color:#fff;padding:12px 30px;text-decoration:none;border-radius:4px;font-weight:bold;'>Track Order</a>" +
            "</div>"
        );
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendOrderShippedEmail(String to, String name, String orderNumber, String trackingNumber) {
        String subject = "Your order " + orderNumber + " has been shipped!";
        String html = buildEmailTemplate(name,
            "Your Order is On Its Way! 📦",
            "Great news! Your order <strong>" + orderNumber + "</strong> has been shipped.",
            "<p><strong>Tracking Number:</strong> " + trackingNumber + "</p>" +
            "<div style='text-align:center;margin:20px 0;'>" +
            "<a href='" + baseUrl + "/account/orders' style='background:#FF9900;color:#fff;padding:12px 30px;text-decoration:none;border-radius:4px;font-weight:bold;'>Track Delivery</a></div>"
        );
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendOrderDeliveredEmail(String to, String name, String orderNumber) {
        String subject = "Order " + orderNumber + " delivered!";
        String html = buildEmailTemplate(name,
            "Your Order Has Been Delivered! ✅",
            "Your order <strong>" + orderNumber + "</strong> has been successfully delivered.",
            "<div style='text-align:center;margin:20px 0;'>" +
            "<a href='" + baseUrl + "/account/orders' style='background:#FF9900;color:#fff;padding:12px 30px;text-decoration:none;border-radius:4px;font-weight:bold;'>Rate & Review</a></div>"
        );
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendReturnApprovedEmail(String to, String name, String orderNumber) {
        String subject = "Return approved for order " + orderNumber;
        String html = buildEmailTemplate(name,
            "Return Request Approved",
            "Your return request for order <strong>" + orderNumber + "</strong> has been approved. We will schedule a pickup soon.",
            ""
        );
        sendHtmlEmail(to, subject, html);
    }

    @Async
    public void sendRefundEmail(String to, String name, String orderNumber, String amount) {
        String subject = "Refund of ₹" + amount + " initiated";
        String html = buildEmailTemplate(name,
            "Refund Initiated 💰",
            "A refund of <strong>₹" + amount + "</strong> has been initiated for order <strong>" + orderNumber + "</strong>. It will be credited to your original payment method within 5-7 business days.",
            ""
        );
        sendHtmlEmail(to, subject, html);
    }

    // ═══════════════════════════════════
    // HTML Email Template Builder
    // ═══════════════════════════════════
    private String buildEmailTemplate(String name, String heading, String message, String contentHtml) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;'>" +
               "<div style='max-width:600px;margin:0 auto;background:#fff;'>" +
               // Header
               "<div style='background:#232F3E;padding:20px;text-align:center;'>" +
               "<h1 style='color:#FF9900;margin:0;font-size:28px;'>Amazon Clone</h1></div>" +
               // Body
               "<div style='padding:30px;'>" +
               "<p style='font-size:16px;'>Hello <strong>" + name + "</strong>,</p>" +
               "<h2 style='color:#232F3E;'>" + heading + "</h2>" +
               "<p style='color:#555;line-height:1.6;'>" + message + "</p>" +
               contentHtml +
               "</div>" +
               // Footer
               "<div style='background:#f4f4f4;padding:20px;text-align:center;font-size:12px;color:#888;'>" +
               "<p>This is an automated email from Amazon Clone. Please do not reply.</p>" +
               "<p>© 2024 Amazon Clone. All rights reserved.</p></div>" +
               "</div></body></html>";
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Email sent to: {} - Subject: {}", to, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
            // Don't throw - email failures shouldn't break the flow
        }
    }
}
