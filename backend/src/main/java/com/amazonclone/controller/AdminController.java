package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.OrderDto;
import com.amazonclone.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse.Success<ApiResponse.AdminDashboard>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.Success.of(adminService.getDashboard()));
    }

    // ── Users ──
    @GetMapping("/users")
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<Map<String, Object>>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        Page<Map<String, Object>> users = adminService.getAllUsers(page, size, search);
        return ResponseEntity.ok(ApiResponse.Success.of(ApiResponse.PagedResponse.<Map<String, Object>>builder()
                .content(users.getContent()).page(users.getNumber()).size(users.getSize())
                .totalElements(users.getTotalElements()).totalPages(users.getTotalPages())
                .first(users.isFirst()).last(users.isLast()).build()));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse.Success<Void>> toggleUserStatus(@PathVariable Long id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.Success.message("User status updated"));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse.Success<Void>> changeRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        adminService.changeUserRole(id, body.get("role"));
        return ResponseEntity.ok(ApiResponse.Success.message("User role updated"));
    }

    // ── Orders ──
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<Map<String, Object>>>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        Page<Map<String, Object>> orders = adminService.getAllOrders(page, size, status);
        return ResponseEntity.ok(ApiResponse.Success.of(ApiResponse.PagedResponse.<Map<String, Object>>builder()
                .content(orders.getContent()).page(orders.getNumber()).size(orders.getSize())
                .totalElements(orders.getTotalElements()).totalPages(orders.getTotalPages())
                .first(orders.isFirst()).last(orders.isLast()).build()));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse.Success<Void>> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        adminService.updateOrderStatus(id, body.get("status"));
        return ResponseEntity.ok(ApiResponse.Success.message("Order status updated"));
    }

    // ── Categories ──
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse.Success<Map<String, Object>>> createCategory(@RequestBody Map<String, Object> body) {
        Map<String, Object> category = adminService.createCategory(
                (String) body.get("name"), (String) body.get("slug"),
                (String) body.get("imageUrl"),
                body.get("parentId") != null ? Long.valueOf(body.get("parentId").toString()) : null);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.Success.of(category, "Category created"));
    }

    // ── Returns ──
    @GetMapping("/returns")
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<OrderDto.ReturnResponse>>> getReturns(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        Page<OrderDto.ReturnResponse> returns = adminService.getAllReturns(page, size, status);
        return ResponseEntity.ok(ApiResponse.Success.of(ApiResponse.PagedResponse.<OrderDto.ReturnResponse>builder()
                .content(returns.getContent()).page(returns.getNumber()).size(returns.getSize())
                .totalElements(returns.getTotalElements()).totalPages(returns.getTotalPages())
                .first(returns.isFirst()).last(returns.isLast()).build()));
    }

    @PutMapping("/returns/{id}/process")
    public ResponseEntity<ApiResponse.Success<Void>> processReturn(@PathVariable Long id, @RequestBody Map<String, String> body) {
        adminService.processReturn(id, body.get("action"));
        return ResponseEntity.ok(ApiResponse.Success.message("Return processed"));
    }
}
