-- ════════════════════════════════════════════════════════════════
-- Amazon Clone - Complete Database Schema
-- MySQL 8.x
-- ════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS amazon_clone
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE amazon_clone;

-- ──────────────────────────────────────
-- USERS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20) UNIQUE,
    password_hash   VARCHAR(255),
    profile_pic     VARCHAR(500),
    auth_provider   ENUM('LOCAL', 'GOOGLE', 'PHONE') NOT NULL DEFAULT 'LOCAL',
    role            ENUM('CUSTOMER', 'SELLER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lock_time       TIMESTAMP NULL,
    last_login      TIMESTAMP NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- USER ADDRESSES
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_addresses (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    address_line1   VARCHAR(255) NOT NULL,
    address_line2   VARCHAR(255),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    pincode         VARCHAR(10) NOT NULL,
    country         VARCHAR(50) NOT NULL DEFAULT 'India',
    is_default      BOOLEAN NOT NULL DEFAULT FALSE,
    address_type    ENUM('HOME', 'WORK', 'OTHER') NOT NULL DEFAULT 'HOME',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- CATEGORIES (Self-referencing for hierarchy)
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    parent_id       BIGINT,
    image_url       VARCHAR(500),
    slug            VARCHAR(150) NOT NULL UNIQUE,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_parent (parent_id),
    INDEX idx_categories_slug (slug)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- SELLERS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS sellers (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL UNIQUE,
    business_name     VARCHAR(200) NOT NULL,
    business_description TEXT,
    gstin             VARCHAR(20),
    business_address  TEXT,
    bank_account      VARCHAR(30),
    ifsc              VARCHAR(15),
    is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
    rating            DECIMAL(3,2) DEFAULT 0.00,
    total_sales       INT NOT NULL DEFAULT 0,
    total_revenue     DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    logo_url          VARCHAR(500),
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sellers_user (user_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- PRODUCTS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    title                   VARCHAR(500) NOT NULL,
    description             TEXT,
    about                   TEXT,
    bullet_points           JSON,
    brand                   VARCHAR(100),
    category_id             BIGINT,
    seller_id               BIGINT,
    price                   DECIMAL(12,2) NOT NULL,
    mrp                     DECIMAL(12,2),
    discount_percent        INT DEFAULT 0,
    stock_quantity          INT NOT NULL DEFAULT 0,
    sku                     VARCHAR(50) UNIQUE,
    weight                  DECIMAL(8,2),
    dimensions              VARCHAR(100),
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured             BOOLEAN NOT NULL DEFAULT FALSE,
    is_deal_of_day          BOOLEAN NOT NULL DEFAULT FALSE,
    ai_generated            BOOLEAN NOT NULL DEFAULT FALSE,
    avg_rating              DECIMAL(3,2) DEFAULT 0.00,
    total_ratings           INT NOT NULL DEFAULT 0,
    total_reviews           INT NOT NULL DEFAULT 0,
    total_sold              INT NOT NULL DEFAULT 0,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE SET NULL,
    INDEX idx_products_category (category_id),
    INDEX idx_products_seller (seller_id),
    INDEX idx_products_brand (brand),
    INDEX idx_products_price (price),
    INDEX idx_products_active (is_active),
    INDEX idx_products_featured (is_featured),
    FULLTEXT INDEX ft_products_search (title, description, brand)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- PRODUCT IMAGES
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    image_url       VARCHAR(500) NOT NULL,
    is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_images_product (product_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- PRODUCT VARIANTS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id      BIGINT NOT NULL,
    variant_name    VARCHAR(100),
    color           VARCHAR(50),
    size            VARCHAR(30),
    storage         VARCHAR(30),
    material        VARCHAR(50),
    price_modifier  DECIMAL(12,2) DEFAULT 0.00,
    stock           INT NOT NULL DEFAULT 0,
    sku_variant     VARCHAR(50),
    image_url       VARCHAR(500),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_variants_product (product_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- PRODUCT RATINGS / REVIEWS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_ratings (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id          BIGINT NOT NULL,
    user_id             BIGINT NOT NULL,
    rating              TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_title        VARCHAR(200),
    review_body         TEXT,
    review_images       JSON,
    verified_purchase   BOOLEAN NOT NULL DEFAULT FALSE,
    helpful_votes       INT NOT NULL DEFAULT 0,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_product_user_rating (product_id, user_id),
    INDEX idx_ratings_product (product_id),
    INDEX idx_ratings_user (user_id),
    INDEX idx_ratings_rating (rating)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- CART
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNIQUE,
    session_id      VARCHAR(100),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_cart_user (user_id),
    INDEX idx_cart_session (session_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- CART ITEMS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id         BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    variant_id      BIGINT,
    quantity        INT NOT NULL DEFAULT 1,
    saved_for_later BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    UNIQUE KEY uk_cart_product_variant (cart_id, product_id, variant_id),
    INDEX idx_cart_items_cart (cart_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- WISHLIST
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uk_wishlist_user_product (user_id, product_id),
    INDEX idx_wishlist_user (user_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- COUPONS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(30) NOT NULL UNIQUE,
    description         VARCHAR(255),
    discount_type       ENUM('PERCENT', 'FLAT') NOT NULL,
    discount_value      DECIMAL(10,2) NOT NULL,
    min_order_amount    DECIMAL(12,2) DEFAULT 0.00,
    max_discount        DECIMAL(10,2),
    usage_limit         INT,
    used_count          INT NOT NULL DEFAULT 0,
    per_user_limit      INT DEFAULT 1,
    valid_from          TIMESTAMP NOT NULL,
    valid_to            TIMESTAMP NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coupons_code (code),
    INDEX idx_coupons_valid (valid_from, valid_to)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- ORDERS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id                 BIGINT NOT NULL,
    order_number            VARCHAR(30) NOT NULL UNIQUE,
    status                  ENUM('PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'PENDING',
    total_amount            DECIMAL(12,2) NOT NULL,
    subtotal_amount         DECIMAL(12,2) NOT NULL,
    discount_amount         DECIMAL(12,2) DEFAULT 0.00,
    tax_amount              DECIMAL(12,2) DEFAULT 0.00,
    shipping_amount         DECIMAL(12,2) DEFAULT 0.00,
    coupon_id               BIGINT,
    coupon_code             VARCHAR(30),
    payment_method          VARCHAR(30),
    payment_status          ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
    shipping_address_id     BIGINT,
    shipping_name           VARCHAR(100),
    shipping_phone          VARCHAR(20),
    shipping_address        TEXT,
    shipping_city           VARCHAR(100),
    shipping_state          VARCHAR(100),
    shipping_pincode        VARCHAR(10),
    notes                   TEXT,
    expected_delivery_date  DATE,
    delivered_at            TIMESTAMP NULL,
    cancelled_at            TIMESTAMP NULL,
    cancellation_reason     TEXT,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_number (order_number),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created (created_at)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- ORDER ITEMS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    variant_id      BIGINT,
    seller_id       BIGINT,
    product_title   VARCHAR(500),
    product_image   VARCHAR(500),
    quantity        INT NOT NULL DEFAULT 1,
    unit_price      DECIMAL(12,2) NOT NULL,
    total_price     DECIMAL(12,2) NOT NULL,
    item_status     ENUM('PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE SET NULL,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id),
    INDEX idx_order_items_seller (seller_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- PAYMENTS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id                BIGINT NOT NULL,
    user_id                 BIGINT NOT NULL,
    payment_gateway         ENUM('STRIPE', 'RAZORPAY', 'COD', 'UPI') NOT NULL,
    transaction_id          VARCHAR(100),
    gateway_order_id        VARCHAR(100),
    gateway_payment_id      VARCHAR(100),
    amount                  DECIMAL(12,2) NOT NULL,
    currency                VARCHAR(5) NOT NULL DEFAULT 'INR',
    status                  ENUM('CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED') NOT NULL DEFAULT 'CREATED',
    payment_method_type     ENUM('CARD', 'UPI', 'NETBANKING', 'WALLET', 'COD', 'EMI') NOT NULL,
    card_last4              VARCHAR(4),
    card_brand              VARCHAR(20),
    refund_amount           DECIMAL(12,2) DEFAULT 0.00,
    refund_id               VARCHAR(100),
    error_code              VARCHAR(50),
    error_message           TEXT,
    metadata                JSON,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_payments_order (order_id),
    INDEX idx_payments_user (user_id),
    INDEX idx_payments_transaction (transaction_id),
    INDEX idx_payments_gateway_order (gateway_order_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- DELIVERY TRACKING
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS delivery_tracking (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_item_id           BIGINT NOT NULL,
    order_id                BIGINT NOT NULL,
    courier_name            VARCHAR(100),
    tracking_number         VARCHAR(100),
    current_status          VARCHAR(50),
    current_location        VARCHAR(200),
    estimated_delivery      DATE,
    actual_delivery         TIMESTAMP NULL,
    delivery_otp            VARCHAR(10),
    delivery_otp_verified   BOOLEAN NOT NULL DEFAULT FALSE,
    timeline_events         JSON,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_delivery_order_item (order_item_id),
    INDEX idx_delivery_tracking_number (tracking_number)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- RETURN REQUESTS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS return_requests (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_item_id       BIGINT NOT NULL,
    order_id            BIGINT NOT NULL,
    user_id             BIGINT NOT NULL,
    reason              ENUM('DEFECTIVE', 'WRONG_ITEM', 'NOT_AS_DESCRIBED', 'CHANGED_MIND', 'DAMAGED_IN_TRANSIT', 'OTHER') NOT NULL,
    description         TEXT,
    images              JSON,
    status              ENUM('REQUESTED', 'APPROVED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'REFUND_INITIATED', 'REFUND_COMPLETED', 'REJECTED') NOT NULL DEFAULT 'REQUESTED',
    refund_amount       DECIMAL(12,2),
    refund_transaction_id VARCHAR(100),
    admin_notes         TEXT,
    pickup_date         DATE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_returns_user (user_id),
    INDEX idx_returns_order (order_id),
    INDEX idx_returns_status (status)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- NOTIFICATIONS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    type            VARCHAR(50) NOT NULL,
    title           VARCHAR(200) NOT NULL,
    message         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    action_url      VARCHAR(500),
    metadata        JSON,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (user_id, is_read)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- OTP TOKENS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS otp_tokens (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    identifier      VARCHAR(255) NOT NULL,
    otp_hash        VARCHAR(255) NOT NULL,
    purpose         ENUM('EMAIL_VERIFY', 'LOGIN', 'PHONE_VERIFY', 'PASSWORD_RESET') NOT NULL,
    expires_at      TIMESTAMP NOT NULL,
    is_used         BOOLEAN NOT NULL DEFAULT FALSE,
    attempts        INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_identifier (identifier),
    INDEX idx_otp_purpose (purpose)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- REFRESH TOKENS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    device_info     VARCHAR(500),
    ip_address      VARCHAR(50),
    expires_at      TIMESTAMP NOT NULL,
    is_revoked      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_refresh_user (user_id),
    INDEX idx_refresh_token (token_hash)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- SEARCH HISTORY
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS search_history (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT,
    query               VARCHAR(255) NOT NULL,
    clicked_product_id  BIGINT,
    results_count       INT DEFAULT 0,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (clicked_product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_search_user (user_id),
    INDEX idx_search_query (query)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- SAVED PAYMENT METHODS
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_payment_methods (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT NOT NULL,
    gateway             ENUM('STRIPE', 'RAZORPAY') NOT NULL,
    gateway_customer_id VARCHAR(100),
    gateway_method_id   VARCHAR(100) NOT NULL,
    method_type         ENUM('CARD', 'UPI', 'NETBANKING') NOT NULL,
    card_last4          VARCHAR(4),
    card_brand          VARCHAR(20),
    card_exp_month      INT,
    card_exp_year       INT,
    upi_id              VARCHAR(100),
    is_default          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_saved_methods_user (user_id)
) ENGINE=InnoDB;

-- ──────────────────────────────────────
-- COUPON USAGE (Track per-user usage)
-- ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupon_usage (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id       BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    order_id        BIGINT NOT NULL,
    used_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_coupon_usage_user (coupon_id, user_id)
) ENGINE=InnoDB;
