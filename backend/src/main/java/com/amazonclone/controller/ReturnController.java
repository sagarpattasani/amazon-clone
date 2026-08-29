package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.OrderDto;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.service.ReturnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService returnService;

    @PostMapping
    public ResponseEntity<ApiResponse.Success<OrderDto.ReturnResponse>> createReturn(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody OrderDto.ReturnRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.Success.of(returnService.createReturnRequest(userDetails.getId(), request), "Return request submitted"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<OrderDto.ReturnResponse>>> getReturns(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDto.ReturnResponse> returns = returnService.getUserReturns(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.Success.of(ApiResponse.PagedResponse.<OrderDto.ReturnResponse>builder()
                .content(returns.getContent()).page(returns.getNumber()).size(returns.getSize())
                .totalElements(returns.getTotalElements()).totalPages(returns.getTotalPages())
                .first(returns.isFirst()).last(returns.isLast()).build()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<OrderDto.ReturnResponse>> getReturn(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.Success.of(returnService.getReturnById(id, userDetails.getId())));
    }
}
