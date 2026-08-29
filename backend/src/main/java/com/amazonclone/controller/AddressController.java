package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.OrderDto;
import com.amazonclone.entity.UserAddress;
import com.amazonclone.entity.User;
import com.amazonclone.exception.GlobalExceptionHandler.*;
import com.amazonclone.repository.UserAddressRepository;
import com.amazonclone.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final UserAddressRepository addressRepository;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<OrderDto.AddressResponse>>> getAddresses(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<UserAddress> addresses = addressRepository.findByUserIdOrderByIsDefaultDesc(userDetails.getId());
        List<OrderDto.AddressResponse> response = addresses.stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.Success.of(response));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse.Success<OrderDto.AddressResponse>> addAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody OrderDto.CreateAddressRequest request) {
        if (request.getIsDefault() != null && request.getIsDefault()) {
            addressRepository.clearDefaultForUser(userDetails.getId());
        }
        User user = new User();
        user.setId(userDetails.getId());
        UserAddress address = UserAddress.builder()
                .user(user)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .country(request.getCountry() != null ? request.getCountry() : "India")
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .addressType(UserAddress.AddressType.valueOf(request.getAddressType() != null ? request.getAddressType() : "HOME"))
                .build();
        address = addressRepository.save(address);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.Success.of(mapToResponse(address), "Address added"));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse.Success<OrderDto.AddressResponse>> updateAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody OrderDto.CreateAddressRequest request) {
        UserAddress address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(userDetails.getId())) {
            throw new BadRequestException("Address not found");
        }
        address.setFullName(request.getFullName());
        address.setPhone(request.getPhone());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        if (request.getIsDefault() != null && request.getIsDefault()) {
            addressRepository.clearDefaultForUser(userDetails.getId());
            address.setIsDefault(true);
        }
        address = addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.Success.of(mapToResponse(address), "Address updated"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse.Success<Void>> deleteAddress(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        UserAddress address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if (!address.getUser().getId().equals(userDetails.getId())) {
            throw new BadRequestException("Address not found");
        }
        addressRepository.delete(address);
        return ResponseEntity.ok(ApiResponse.Success.message("Address deleted"));
    }

    private OrderDto.AddressResponse mapToResponse(UserAddress a) {
        return OrderDto.AddressResponse.builder()
                .id(a.getId()).fullName(a.getFullName()).phone(a.getPhone())
                .addressLine1(a.getAddressLine1()).addressLine2(a.getAddressLine2())
                .city(a.getCity()).state(a.getState()).pincode(a.getPincode())
                .country(a.getCountry()).isDefault(a.getIsDefault())
                .addressType(a.getAddressType().name()).build();
    }
}
