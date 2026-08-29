package com.amazonclone.service;

import com.amazonclone.dto.OrderDto;
import com.amazonclone.entity.*;
import com.amazonclone.exception.GlobalExceptionHandler.*;
import com.amazonclone.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;

    @Transactional(readOnly = true)
    public OrderDto.CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        List<CartItem> items = cartItemRepository.findByCartIdAndSavedForLaterFalse(cart.getId());
        List<CartItem> savedItems = cartItemRepository.findByCartIdAndSavedForLaterTrue(cart.getId());

        BigDecimal subtotal = items.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OrderDto.CartResponse.builder()
                .cartId(cart.getId())
                .items(items.stream().map(this::mapToCartItemResponse).collect(Collectors.toList()))
                .savedForLater(savedItems.stream().map(this::mapToCartItemResponse).collect(Collectors.toList()))
                .subtotal(subtotal)
                .totalItems(items.size())
                .build();
    }

    @Transactional
    public OrderDto.CartResponse addToCart(Long userId, OrderDto.AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.isInStock()) {
            throw new BadRequestException("Product is out of stock");
        }

        // Check existing item
        CartItem existingItem;
        if (request.getVariantId() != null) {
            existingItem = cartItemRepository.findByCartIdAndProductIdAndVariantId(
                    cart.getId(), request.getProductId(), request.getVariantId()).orElse(null);
        } else {
            existingItem = cartItemRepository.findByCartIdAndProductId(
                    cart.getId(), request.getProductId()).orElse(null);
        }

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            existingItem.setSavedForLater(false);
            cartItemRepository.save(existingItem);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            if (request.getVariantId() != null) {
                ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException("Variant not found"));
                item.setVariant(variant);
            }
            cartItemRepository.save(item);
        }

        return getCart(userId);
    }

    @Transactional
    public OrderDto.CartResponse updateCartItem(Long userId, Long itemId, OrderDto.UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return getCart(userId);
    }

    @Transactional
    public OrderDto.CartResponse removeCartItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        cartItemRepository.delete(item);
        return getCart(userId);
    }

    @Transactional
    public OrderDto.CartResponse saveForLater(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.setSavedForLater(true);
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public OrderDto.CartResponse moveToCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.setSavedForLater(false);
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = new User();
            user.setId(userId);
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    private OrderDto.CartItemResponse mapToCartItemResponse(CartItem item) {
        Product p = item.getProduct();
        String primaryImage = productImageRepository.findFirstByProductIdAndIsPrimaryTrue(p.getId())
                .map(ProductImage::getImageUrl).orElse(null);

        return OrderDto.CartItemResponse.builder()
                .id(item.getId())
                .productId(p.getId())
                .productTitle(p.getTitle())
                .productImage(primaryImage)
                .brand(p.getBrand())
                .price(p.getPrice())
                .mrp(p.getMrp())
                .discountPercent(p.getDiscountPercent())
                .quantity(item.getQuantity())
                .inStock(p.isInStock())
                .availableStock(p.getStockQuantity())
                .variantId(item.getVariant() != null ? item.getVariant().getId() : null)
                .variantName(item.getVariant() != null ? item.getVariant().getVariantName() : null)
                .build();
    }
}
