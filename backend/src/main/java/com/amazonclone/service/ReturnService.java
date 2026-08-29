package com.amazonclone.service;

import com.amazonclone.dto.OrderDto;
import com.amazonclone.entity.*;
import com.amazonclone.exception.GlobalExceptionHandler.*;
import com.amazonclone.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReturnService {

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Transactional
    public OrderDto.ReturnResponse createReturnRequest(Long userId, OrderDto.ReturnRequestDto request) {
        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found"));

        Order order = orderItem.getOrder();
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("This order doesn't belong to you");
        }

        if (order.getStatus() != Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Returns can only be initiated for delivered orders");
        }

        if (returnRequestRepository.existsByOrderItemId(request.getOrderItemId())) {
            throw new DuplicateResourceException("Return request already exists for this item");
        }

        // Check 10-day return window
        if (order.getDeliveredAt() != null &&
                order.getDeliveredAt().plusDays(10).isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Return window has expired (10 days)");
        }

        User user = new User();
        user.setId(userId);

        ReturnRequest returnRequest = ReturnRequest.builder()
                .orderItem(orderItem)
                .order(order)
                .user(user)
                .reason(ReturnRequest.ReturnReason.valueOf(request.getReason().toUpperCase()))
                .description(request.getDescription())
                .images(request.getImages())
                .status(ReturnRequest.ReturnStatus.REQUESTED)
                .refundAmount(orderItem.getTotalPrice())
                .build();

        returnRequest = returnRequestRepository.save(returnRequest);

        // Update order item status
        orderItem.setItemStatus(Order.OrderStatus.RETURN_REQUESTED);
        orderItemRepository.save(orderItem);

        // Send email
        User fullUser = userRepository.findById(userId).orElse(null);
        if (fullUser != null) {
            emailService.sendReturnApprovedEmail(fullUser.getEmail(), fullUser.getName(), order.getOrderNumber());
        }

        log.info("Return request created for order item {} by user {}", request.getOrderItemId(), userId);
        return mapToResponse(returnRequest);
    }

    @Transactional(readOnly = true)
    public Page<OrderDto.ReturnResponse> getUserReturns(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return returnRequestRepository.findByUserId(userId, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public OrderDto.ReturnResponse getReturnById(Long returnId, Long userId) {
        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found"));
        if (!returnRequest.getUser().getId().equals(userId)) {
            throw new BadRequestException("This return doesn't belong to you");
        }
        return mapToResponse(returnRequest);
    }

    private OrderDto.ReturnResponse mapToResponse(ReturnRequest r) {
        return OrderDto.ReturnResponse.builder()
                .id(r.getId())
                .orderItemId(r.getOrderItem().getId())
                .productTitle(r.getOrderItem().getProductTitle())
                .productImage(r.getOrderItem().getProductImage())
                .reason(r.getReason().name())
                .description(r.getDescription())
                .status(r.getStatus().name())
                .refundAmount(r.getRefundAmount())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
