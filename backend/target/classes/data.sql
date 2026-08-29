-- ════════════════════════════════════════════════════════════════
-- Amazon Clone - Seed Data
-- ════════════════════════════════════════════════════════════════

USE amazon_clone;

-- ──────────────────────────────────────
-- ADMIN USER (password: Admin@123)
-- BCrypt hash of 'Admin@123'
-- ──────────────────────────────────────
INSERT IGNORE INTO users (id, name, email, phone, password_hash, auth_provider, role, is_verified, is_phone_verified, is_active) VALUES
(1, 'Admin User', 'admin@amazonclone.com', '+919999999999', '$2a$12$LJ3m4ys3SZZGK8v8PXyc6uIIX.J3YOPP0nQzqJHYxgMFmXfB5HXLi', 'LOCAL', 'SUPER_ADMIN', TRUE, TRUE, TRUE),
(2, 'Test Customer', 'customer@test.com', '+919888888888', '$2a$12$LJ3m4ys3SZZGK8v8PXyc6uIIX.J3YOPP0nQzqJHYxgMFmXfB5HXLi', 'LOCAL', 'CUSTOMER', TRUE, TRUE, TRUE),
(3, 'Seller One', 'seller1@test.com', '+919777777777', '$2a$12$LJ3m4ys3SZZGK8v8PXyc6uIIX.J3YOPP0nQzqJHYxgMFmXfB5HXLi', 'LOCAL', 'SELLER', TRUE, TRUE, TRUE),
(4, 'Seller Two', 'seller2@test.com', '+919666666666', '$2a$12$LJ3m4ys3SZZGK8v8PXyc6uIIX.J3YOPP0nQzqJHYxgMFmXfB5HXLi', 'LOCAL', 'SELLER', TRUE, TRUE, TRUE);

-- ──────────────────────────────────────
-- ADDRESSES
-- ──────────────────────────────────────
INSERT IGNORE INTO user_addresses (user_id, full_name, phone, address_line1, address_line2, city, state, pincode, country, is_default, address_type) VALUES
(2, 'Test Customer', '+919888888888', '123 MG Road', 'Near City Mall', 'Mumbai', 'Maharashtra', '400001', 'India', TRUE, 'HOME'),
(2, 'Test Customer Office', '+919888888888', '456 Business Park', 'Sector 5', 'Mumbai', 'Maharashtra', '400051', 'India', FALSE, 'WORK');

-- ──────────────────────────────────────
-- SELLERS
-- ──────────────────────────────────────
INSERT IGNORE INTO sellers (id, user_id, business_name, business_description, gstin, is_verified, rating, total_sales) VALUES
(1, 3, 'TechVault India', 'Premium electronics and gadgets retailer with nationwide delivery', 'GSTIN001234567', TRUE, 4.50, 15000),
(2, 4, 'FashionHub Store', 'Trendy fashion and lifestyle products at best prices', 'GSTIN009876543', TRUE, 4.30, 8500);

-- ──────────────────────────────────────
-- CATEGORIES (Hierarchy)
-- ──────────────────────────────────────
INSERT IGNORE INTO categories (id, name, parent_id, slug, description, is_active, sort_order) VALUES
-- Top-level
(1,  'Electronics',     NULL, 'electronics',      'Smartphones, Laptops, Cameras & more', TRUE, 1),
(2,  'Fashion',         NULL, 'fashion',           'Clothing, Footwear, Watches & Accessories', TRUE, 2),
(3,  'Home & Kitchen',  NULL, 'home-kitchen',      'Furniture, Decor, Kitchen Appliances', TRUE, 3),
(4,  'Books',           NULL, 'books',             'Fiction, Non-Fiction, Textbooks & more', TRUE, 4),
(5,  'Beauty & Health', NULL, 'beauty-health',     'Skincare, Makeup, Wellness Products', TRUE, 5),
(6,  'Sports & Outdoors', NULL, 'sports-outdoors', 'Fitness, Camping, Sports Equipment', TRUE, 6),
(7,  'Toys & Games',    NULL, 'toys-games',        'Educational Toys, Board Games, Action Figures', TRUE, 7),
(8,  'Grocery',         NULL, 'grocery',           'Daily Essentials, Snacks, Beverages', TRUE, 8),
-- Sub-categories: Electronics
(10, 'Smartphones',     1,  'smartphones',        'Latest smartphones from top brands', TRUE, 1),
(11, 'Laptops',         1,  'laptops',            'Laptops for work, gaming and everyday use', TRUE, 2),
(12, 'Headphones',      1,  'headphones',         'Wireless, Wired, Noise Cancelling', TRUE, 3),
(13, 'Cameras',         1,  'cameras',            'DSLR, Mirrorless, Action Cameras', TRUE, 4),
(14, 'Tablets',         1,  'tablets',            'iPads, Android Tablets, E-readers', TRUE, 5),
(15, 'Smart Watches',   1,  'smart-watches',      'Fitness Trackers and Smartwatches', TRUE, 6),
-- Sub-categories: Fashion
(20, 'Men\'s Clothing',  2, 'mens-clothing',      'T-shirts, Shirts, Jeans, Suits', TRUE, 1),
(21, 'Women\'s Clothing', 2, 'womens-clothing',   'Dresses, Tops, Ethnic Wear', TRUE, 2),
(22, 'Footwear',        2,  'footwear',           'Sneakers, Formal Shoes, Sandals', TRUE, 3),
(23, 'Watches',         2,  'watches',            'Analog, Digital, Luxury Watches', TRUE, 4),
(24, 'Bags & Luggage',  2,  'bags-luggage',       'Backpacks, Handbags, Suitcases', TRUE, 5),
-- Sub-categories: Home & Kitchen
(30, 'Furniture',       3,  'furniture',          'Sofas, Tables, Beds, Shelves', TRUE, 1),
(31, 'Kitchen Appliances', 3, 'kitchen-appliances', 'Mixers, Toasters, Coffee Makers', TRUE, 2),
(32, 'Home Decor',      3,  'home-decor',         'Wall Art, Candles, Vases', TRUE, 3),
(33, 'Bedding',         3,  'bedding',            'Mattresses, Pillows, Bed Sheets', TRUE, 4);

-- ──────────────────────────────────────
-- PRODUCTS (50+ realistic products)
-- ──────────────────────────────────────

-- === SMARTPHONES ===
INSERT IGNORE INTO products (id, title, description, about, bullet_points, brand, category_id, seller_id, price, mrp, discount_percent, stock_quantity, sku, is_active, is_featured, avg_rating, total_ratings, total_reviews) VALUES
(1, 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB, 12GB RAM)',
 'Experience the pinnacle of smartphone innovation with the Samsung Galaxy S24 Ultra. Featuring a stunning 6.8-inch Dynamic AMOLED 2X display with a resolution of 3120x1440, powered by the Snapdragon 8 Gen 3 processor. The built-in S Pen and Galaxy AI features transform how you communicate, create, and connect.',
 'The Galaxy S24 Ultra represents Samsung''s most advanced smartphone, built with aerospace-grade titanium for premium durability. With its 200MP main camera system and enhanced AI-powered photography features, every shot is a masterpiece.',
 '["6.8-inch Dynamic AMOLED 2X Display, 3120x1440 resolution", "Snapdragon 8 Gen 3 for Galaxy processor", "200MP + 12MP + 50MP + 10MP Quad Camera System", "5000mAh battery with 45W Super Fast Charging", "Built-in S Pen with AI-powered features", "Android 14 with One UI 6.1", "IP68 Water and Dust Resistant"]',
 'Samsung', 10, 1, 124999.00, 144999.00, 14, 150, 'SAM-S24U-256-BLK', TRUE, TRUE, 4.60, 28540, 12890),

(2, 'Apple iPhone 15 Pro Max (Natural Titanium, 256GB)',
 'iPhone 15 Pro Max. Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever. With a 6.7-inch Super Retina XDR display with ProMotion technology.',
 'The most pro iPhone ever. Featuring a strong and lightweight titanium design with a textured matte finish. The A17 Pro chip enables console-quality gaming and next-generation performance. The 48MP Main camera with second-generation sensor-shift OIS delivers stunning detail.',
 '["6.7-inch Super Retina XDR OLED Display with ProMotion", "A17 Pro chip with 6-core GPU", "48MP Main + 12MP Ultra Wide + 12MP Telephoto Camera", "4441mAh battery with USB-C charging", "Action Button for quick access to features", "iOS 17 with Dynamic Island", "Ceramic Shield front, Titanium design"]',
 'Apple', 10, 1, 159900.00, 179900.00, 11, 200, 'APL-IP15PM-256-TIT', TRUE, TRUE, 4.70, 45230, 19870),

(3, 'OnePlus 12 5G (Flowy Emerald, 256GB, 12GB RAM)',
 'The OnePlus 12 sets a new standard with its Snapdragon 8 Gen 3 processor, Hasselblad 4th Gen Camera, and stunning 2K 120Hz ProXDR Display. Experience unmatched speed with 100W SUPERVOOC fast charging.',
 'Crafted with precision, the OnePlus 12 features a Hasselblad-tuned triple camera system that captures professional-quality photos. The 5400mAh battery with 100W SUPERVOOC charges fully in just 26 minutes.',
 '["6.82-inch 2K ProXDR AMOLED Display, 120Hz LTPO", "Snapdragon 8 Gen 3 Mobile Platform", "50MP Sony LYT-808 + 64MP Periscope + 48MP Ultra-Wide", "5400mAh battery with 100W SUPERVOOC charging", "Hasselblad 4th Generation Camera System", "OxygenOS 14 based on Android 14", "Rain Water Touch technology"]',
 'OnePlus', 10, 1, 64999.00, 69999.00, 7, 300, 'OP-12-256-EMR', TRUE, FALSE, 4.50, 18920, 8450),

(4, 'Google Pixel 8 Pro (Obsidian, 128GB)',
 'The Google Pixel 8 Pro is built for the era of AI with Google Tensor G3 chip. Featuring a 6.7-inch Super Actua display, best-in-class camera with AI photo editing, and 7 years of security updates.',
 'Pixel 8 Pro is Google''s most advanced phone yet, powered by Google Tensor G3 with Titan M2 security chip. The Pro-level camera system with AI-powered editing tools makes every photo extraordinary.',
 '["6.7-inch Super Actua LTPO OLED Display, 2992x1344", "Google Tensor G3 with Titan M2 security", "50MP Main + 48MP Ultra Wide + 48MP Telephoto", "5050mAh battery with 30W fast charging", "Magic Eraser, Best Take, Audio Magic Eraser", "7 years of OS and security updates", "IP68 Water and Dust Resistant"]',
 'Google', 10, 1, 84999.00, 106999.00, 21, 175, 'GOO-PX8P-128-OBS', TRUE, TRUE, 4.40, 12350, 5670),

(5, 'Xiaomi 14 Ultra 5G (Black, 512GB, 16GB RAM)',
 'The Xiaomi 14 Ultra combines Leica professional optics with the powerful Snapdragon 8 Gen 3 processor. Experience photography at its finest with the Leica Summilux 1-inch sensor and variable aperture.',
 'A masterpiece of mobile photography, the Xiaomi 14 Ultra features a Leica Summilux quad camera system with a 1-inch Sony LYT-900 sensor. The variable aperture lens adapts to any lighting condition.',
 '["6.73-inch 2K LTPO AMOLED Display, 3200x1440", "Snapdragon 8 Gen 3 with 16GB LPDDR5X RAM", "50MP Leica Summilux 1-inch Main + 50MP Ultra-Wide + 50MP 3.2x + 50MP 5x", "5000mAh battery with 90W HyperCharge", "Leica Professional Optical System", "IP68 Dust and Water Resistant", "Photography Kit support with grip accessory"]',
 'Xiaomi', 10, 1, 99999.00, 109999.00, 9, 100, 'XIA-14U-512-BLK', TRUE, FALSE, 4.30, 6780, 3120),

-- === LAPTOPS ===
(6, 'Apple MacBook Air M3 (15-inch, Midnight, 16GB RAM, 512GB SSD)',
 'The remarkably thin 15-inch MacBook Air with the M3 chip delivers incredible performance in a fanless design. Up to 18 hours of battery life, a stunning Liquid Retina display, and the power of Apple Intelligence.',
 'Supercharged by the M3 chip, the 15-inch MacBook Air brings exceptional performance and capabilities in an impossibly thin design. With 16GB of unified memory and a 10-core GPU, it handles everything from creative work to everyday tasks effortlessly.',
 '["15.3-inch Liquid Retina Display, 2880x1864 resolution", "Apple M3 chip with 8-core CPU and 10-core GPU", "16GB Unified Memory, 512GB SSD Storage", "Up to 18 hours battery life", "1080p FaceTime HD Camera with advanced ISP", "MagSafe charging, 2x Thunderbolt/USB 4 ports", "macOS with Apple Intelligence support"]',
 'Apple', 11, 1, 154900.00, 164900.00, 6, 80, 'APL-MBA15-M3-512-MID', TRUE, TRUE, 4.80, 15680, 7230),

(7, 'ASUS ROG Strix G16 Gaming Laptop (Intel i9-14900HX, RTX 4070, 16GB, 1TB)',
 'Dominate the competition with the ROG Strix G16. Powered by Intel Core i9-14900HX and NVIDIA GeForce RTX 4070, with a blazing-fast 240Hz display for the ultimate gaming experience.',
 'The ROG Strix G16 is engineered for gamers who demand the best. With up to 175W total GPU power, an intelligent cooling system with Tri-Fan Technology, and a 16-inch QHD+ 240Hz display, every game looks incredible.',
 '["16-inch QHD+ (2560x1600) 240Hz IPS Display", "Intel Core i9-14900HX Processor (24 Cores)", "NVIDIA GeForce RTX 4070 8GB GDDR6 (175W TGP)", "16GB DDR5-5600MHz RAM, 1TB PCIe Gen4 NVMe SSD", "ROG Intelligent Cooling with Tri-Fan Technology", "Per-key RGB Backlit Keyboard", "Windows 11 Home, WiFi 6E, Thunderbolt 4"]',
 'ASUS', 11, 1, 159990.00, 189990.00, 16, 45, 'ASUS-ROG-G16-I9-4070', TRUE, TRUE, 4.50, 8920, 4150),

(8, 'Lenovo ThinkPad X1 Carbon Gen 11 (Intel i7, 16GB, 512GB, 14" WUXGA)',
 'The iconic ThinkPad X1 Carbon delivers enterprise-grade performance and security in an ultralight 2.48 lb chassis. Perfect for business professionals who need reliability, security, and all-day battery life.',
 'Built for the modern professional, the X1 Carbon Gen 11 combines the legendary ThinkPad keyboard with cutting-edge security features including fingerprint reader, IR camera, and Intel vPro platform.',
 '["14-inch WUXGA (1920x1200) IPS Anti-Glare Display", "13th Gen Intel Core i7-1365U Processor", "16GB LPDDR5x-6400 RAM, 512GB PCIe Gen4 SSD", "Intel vPro Enterprise Platform", "Fingerprint Reader + IR Camera with Human Presence Detection", "MIL-STD-810H Military Grade Tested", "Up to 15 hours battery, Rapid Charge, 1.24kg"]',
 'Lenovo', 11, 1, 142990.00, 164990.00, 13, 60, 'LEN-X1C-G11-I7-512', TRUE, FALSE, 4.60, 11230, 5670),

-- === HEADPHONES ===
(9, 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)',
 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 8 microphones and advanced audio signal processing. Up to 30 hours battery life with quick charging.',
 'The WH-1000XM5 headphones rewrite the rules for noise cancellation with two processors controlling 8 microphones. A newly designed driver unit and 30mm dome delivers exceptional sound quality across all frequencies.',
 '["Industry-leading noise cancellation with Auto NC Optimizer", "Exceptional sound with 30mm custom driver", "Crystal clear calls with 8-mic system + AI noise reduction", "30-hour battery life, 3-min quick charge = 3 hours", "Multipoint Bluetooth for 2 devices simultaneously", "Speak-to-Chat auto pauses music", "Ultra-comfortable lightweight design (250g)"]',
 'Sony', 12, 1, 26990.00, 34990.00, 23, 200, 'SONY-WH1000XM5-BLK', TRUE, TRUE, 4.70, 32150, 15670),

(10, 'Apple AirPods Pro (2nd Gen) with USB-C MagSafe Case',
 'Rebuilt from the sound up. Active Noise Cancellation up to 2x more effective. Adaptive Audio seamlessly blends Transparency and Active Noise Cancellation. Personalized Spatial Audio with dynamic head tracking.',
 'AirPods Pro feature up to 2x more Active Noise Cancellation than the previous generation. The H2 chip and custom drivers deliver rich, vivid sound. With Adaptive Audio, the listening experience automatically adjusts to your environment.',
 '["Up to 2x more Active Noise Cancellation", "Adaptive Audio blends Transparency & ANC", "Personalized Spatial Audio with dynamic head tracking", "6 hours listening, 30 hours total with MagSafe case", "USB-C MagSafe Charging Case with speaker & lanyard loop", "IP54 Dust and Water Resistant (earbuds & case)", "Touch controls for media, calls, and Siri"]',
 'Apple', 12, 1, 24900.00, 26900.00, 7, 350, 'APL-APP2-USBC', TRUE, TRUE, 4.60, 28670, 13450),

-- === CAMERAS ===
(11, 'Sony Alpha 7 IV Mirrorless Camera (Body Only)',
 'The new basic. The α7 IV is a true hybrid camera with 33MP full-frame sensor, outstanding autofocus, and 4K 60p video recording. Ideal for both photographers and content creators who demand versatility.',
 'The Alpha 7 IV sets a new standard for full-frame mirrorless cameras. With a 33MP Exmor R CMOS sensor, BIONZ XR processor, and Real-time Eye AF for humans, animals, and birds, it captures life with unprecedented detail and accuracy.',
 '["33MP Full-Frame Exmor R CMOS Image Sensor", "BIONZ XR Image Processing Engine", "759-point Phase Detection AF with Real-time Eye AF", "4K 60p 10-bit 4:2:2 Video Recording", "3.0-inch Vari-angle Touchscreen LCD", "ISO 50-204800, 10fps continuous shooting", "5-axis In-Body Image Stabilization (5.5 stops)"]',
 'Sony', 13, 1, 198990.00, 229990.00, 13, 30, 'SONY-A7IV-BODY', TRUE, FALSE, 4.70, 5680, 2890),

-- === TABLETS ===
(12, 'Apple iPad Air M2 (11-inch, Wi-Fi, 256GB, Space Gray)',
 'iPad Air with the powerful M2 chip. Stunning 11-inch Liquid Retina display, works with Apple Pencil Pro and Magic Keyboard. Perfect for creative work, productivity, and entertainment.',
 'The new iPad Air is supercharged with the M2 chip, delivering next-level performance for multitasking, creative work, and gaming. With support for Apple Pencil Pro and Wi-Fi 6E, it''s your ultimate portable workstation.',
 '["11-inch Liquid Retina Display with P3 wide color", "Apple M2 chip with 8-core CPU and 10-core GPU", "256GB Storage", "12MP Wide camera + 12MP Ultra Wide front camera", "USB-C with support for accessories", "Works with Apple Pencil Pro and Magic Keyboard", "Touch ID, WiFi 6E, All-day battery life"]',
 'Apple', 14, 1, 59900.00, 64900.00, 8, 120, 'APL-IPADAIR-M2-256-GRY', TRUE, TRUE, 4.60, 18900, 8760),

-- === SMART WATCHES ===
(13, 'Apple Watch Series 9 (GPS, 45mm, Midnight Aluminum)',
 'The most advanced Apple Watch ever. S9 SiP chip enables a magical new double tap gesture. Precision Finding for iPhone. Brighter Always-On Retina display. Carbon neutral options available.',
 'Apple Watch Series 9 features the powerful S9 SiP chip that makes everything faster. The magical Double Tap gesture lets you control your watch without touching the screen. Up to 2000 nits brightness for easy reading outdoors.',
 '["45mm Always-On Retina LTPO OLED Display (2000 nits)", "Apple S9 SiP with 4-core Neural Engine", "Double Tap gesture for hands-free control", "Precision Finding for iPhone with Ultra Wideband", "Advanced Health: Blood Oxygen, ECG, Heart Rate, Temperature", "50m Water Resistant, IP6X Dust Resistant", "Up to 18 hours battery life, watchOS 10"]',
 'Apple', 15, 1, 41900.00, 46900.00, 11, 180, 'APL-AW9-45-MID', TRUE, TRUE, 4.50, 22340, 10560),

-- === MEN'S CLOTHING ===
(14, 'Levi''s Men''s 511 Slim Fit Jeans (Dark Blue)',
 'The Levi''s 511 Slim Fit sits below the waist with a slim leg from hip to ankle. Made with Flex technology for comfort and mobility. A modern slim fit that''s never too tight.',
 'Crafted from premium stretch denim, the 511 Slim Fit is Levi''s quintessential modern slim jean. The slight stretch fabric moves with you throughout the day while maintaining its shape.',
 '["Slim fit through hip and thigh, slim leg opening", "Made with Advanced Stretch for comfort", "5-pocket styling with zip fly", "98% Cotton, 2% Elastane for flex comfort", "Machine washable, fade-resistant", "Available in multiple washes and sizes", "Iconic Levi''s Red Tab and leather patch"]',
 'Levi''s', 20, 2, 2799.00, 4599.00, 39, 500, 'LEV-511-DKBLUE', TRUE, FALSE, 4.30, 45670, 19870),

(15, 'Nike Men''s Dri-FIT Academy Football T-Shirt (Black)',
 'Designed for the pitch but built for everyday, the Nike Dri-FIT Academy T-Shirt uses sweat-wicking technology to keep you dry and comfortable during training and casual wear.',
 'Nike Dri-FIT technology moves sweat away from your skin for quicker evaporation. The lightweight mesh back panel provides ventilation where you need it most during intense training sessions.',
 '["Nike Dri-FIT technology wicks sweat away", "Breathable mesh back panel for ventilation", "Standard fit for relaxed, easy feel", "100% Recycled Polyester, sustainable materials", "Raglan sleeves for natural range of motion", "Machine washable, holds shape wash after wash", "Iconic Nike Swoosh logo"]',
 'Nike', 20, 2, 1795.00, 2495.00, 28, 800, 'NIKE-DRI-ACAD-BLK', TRUE, FALSE, 4.40, 34560, 15230),

-- === WOMEN'S CLOTHING ===
(16, 'ZARA Women''s Satin Midi Dress (Emerald Green)',
 'Elegant satin midi dress with a flattering V-neckline and adjustable straps. The flowing silhouette and luxurious satin fabric make it perfect for both special occasions and evening outings.',
 'This stunning satin midi dress drapes beautifully and catches the light for a sophisticated look. The emerald green colorway adds a touch of glamour, while the midi length is universally flattering.',
 '["V-neckline with adjustable spaghetti straps", "Luxurious satin fabric with smooth finish", "Midi length falls below the knee", "Side slit for ease of movement", "Hidden back zip closure", "100% Polyester Satin, dry clean recommended", "Available in XS, S, M, L, XL"]',
 'ZARA', 21, 2, 3490.00, 5990.00, 42, 200, 'ZARA-SATIN-MIDI-GRN', TRUE, TRUE, 4.50, 12340, 6780),

-- === FOOTWEAR ===
(17, 'Nike Air Max 270 React Men''s Shoes (White/Black)',
 'Taking inspiration from the Nike Air Max pantheon, the Nike Air Max 270 React combines two of Nike''s biggest innovations for an incredibly smooth ride. Max Air 270 unit delivers unrivaled cushioning.',
 'The Nike Air Max 270 React pairs a full-length React foam midsole with a Max Air 270 unit for soft, bouncy cushioning. The sleek design looks great with any outfit while the lightweight build keeps you comfortable all day.',
 '["Max Air 270 unit for superior heel cushioning", "Full-length React foam midsole for smooth ride", "No-sew overlays for sleek, durable design", "Rubber outsole for excellent traction", "Lightweight and breathable mesh upper", "Pull tab for easy on and off", "Available in multiple color combinations"]',
 'Nike', 22, 2, 12995.00, 15995.00, 19, 150, 'NIKE-AM270-REACT-WB', TRUE, TRUE, 4.40, 23450, 10980),

(18, 'adidas Ultraboost 23 Men''s Running Shoes (Core Black)',
 'Feel the energy return with every stride. The Ultraboost 23 features Linear Energy Push system and BOOST midsole for incredible comfort and responsiveness. Primeknit+ upper adapts to your foot.',
 'The Ultraboost 23 introduces the Linear Energy Push system that works with BOOST midsole technology to deliver explosive energy return. The Primeknit+ upper provides a sock-like fit that adapts to your foot shape.',
 '["BOOST midsole for unmatched energy return", "Linear Energy Push for enhanced forward propulsion", "Primeknit+ upper for adaptive sock-like fit", "Continental Rubber outsole for grip in all conditions", "Torsion System for midfoot support", "Fitcounter molded heel counter", "Made with recycled materials, Parley ocean plastic"]',
 'adidas', 22, 2, 14999.00, 19999.00, 25, 120, 'ADI-UB23-CBLK', TRUE, FALSE, 4.50, 18760, 8340),

-- === WATCHES ===
(19, 'Fossil Gen 6 Hybrid Smartwatch (Brown Leather, 44mm)',
 'The best of both worlds. Fossil Gen 6 Hybrid combines classic analog watch design with smart features including heart rate monitoring, notifications, and up to 2 weeks battery life.',
 'Unlike full smartwatches, the Gen 6 Hybrid maintains the classic look of a traditional timepiece while offering essential smart features. The genuine leather strap and stainless steel case elevate any outfit.',
 '["Classic analog watch face with hidden E-Ink display", "Heart rate sensor and SpO2 monitoring", "Phone notifications, weather, and calendar alerts", "Up to 2 weeks battery life", "Genuine Italian leather strap, 44mm case", "5 ATM Water Resistant", "Fossil Smartwatches app for Android & iOS"]',
 'Fossil', 23, 2, 14995.00, 22495.00, 33, 90, 'FOSSIL-G6H-BRN-44', TRUE, FALSE, 4.20, 8900, 4120),

-- === BAGS ===
(20, 'American Tourister Urban Groove Laptop Backpack (Black, 15.6")',
 'Carry your essentials in style with the Urban Groove laptop backpack. Designed for professionals with a dedicated padded laptop compartment, organizer pocket, and ergonomic shoulder straps.',
 'The American Tourister Urban Groove combines functionality with urban style. The padded laptop compartment fits up to 15.6-inch laptops, while multiple organizer pockets keep your accessories neatly arranged.',
 '["Fits laptops up to 15.6 inches with padded compartment", "Ergonomic S-shaped shoulder straps for comfort", "Water-resistant polyester fabric", "Multiple organizer pockets for accessories", "Trolley strap for easy travel attachment", "Reflective details for night visibility", "Compact design: 30L capacity, lightweight"]',
 'American Tourister', 24, 2, 1899.00, 3500.00, 46, 400, 'AT-URBGRV-BLK-156', TRUE, FALSE, 4.30, 56780, 24560),

-- === FURNITURE ===
(21, 'IKEA KALLAX Shelf Unit (White, 4x4, 147x147cm)',
 'Versatile storage that works throughout your home. Use it as a room divider, sideboard, or traditional bookshelf. The clean, simple design fits seamlessly with any decor style.',
 'The KALLAX series is one of IKEA''s most popular and versatile storage solutions. Each compartment can hold bins, baskets, or your favorite books and decor items. The sturdy engineered wood construction ensures long-lasting durability.',
 '["16 compartments for flexible storage", "Can be placed horizontally or vertically", "Works as room divider or against a wall", "Engineered wood with white lacquered finish", "Each compartment: 33x33cm inner dimensions", "Assembly required, hardware included", "Dimensions: 147 x 147 x 39 cm"]',
 'IKEA', 30, 2, 12990.00, 15990.00, 19, 25, 'IKEA-KALLAX-4X4-WHT', TRUE, FALSE, 4.40, 15670, 7890),

-- === KITCHEN APPLIANCES ===
(22, 'Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker (6 Quart)',
 'The number one selling multi-cooker in America. 9 appliances in 1: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, warmer, sterilizer, and sous vide.',
 'The Instant Pot Duo Plus combines 9 appliances into one, saving counter space and cooking time. With 15 customizable programs and advanced safety features, it makes cooking delicious meals effortless.',
 '["9-in-1: Pressure, Slow, Rice Cooker + 6 more", "15 One-Touch Smart Programs", "Stainless steel inner pot, dishwasher safe", "Advanced safety with 10+ built-in protections", "Cooks up to 70% faster than traditional methods", "6-quart capacity feeds 4-6 people", "Energy efficient, uses up to 70% less energy"]',
 'Instant Pot', 31, 1, 8999.00, 12999.00, 31, 150, 'IP-DUO-PLUS-6QT', TRUE, TRUE, 4.60, 67890, 34560),

-- === HOME DECOR ===
(23, 'Philips Hue White & Color Ambiance Starter Kit (3 Bulbs + Bridge)',
 'Transform your home lighting with millions of colors and shades of white light. Control with your voice, the Hue app, or automation. Create custom scenes and schedules for any mood.',
 'The Philips Hue White & Color Ambiance Starter Kit includes everything you need to get started with smart lighting. Set the perfect ambiance with 16 million colors, automate your lights, and control them from anywhere.',
 '["3x E27 Smart LED Bulbs + Hue Bridge included", "16 million colors + warm to cool white", "Voice control with Alexa, Google, Apple HomeKit", "Schedule lights, set scenes, geofencing", "Energy efficient LED, A60 shape, 1100 lumen", "Control from anywhere with Hue app", "Compatible with 100+ smart home devices"]',
 'Philips', 32, 1, 13999.00, 17999.00, 22, 80, 'PHI-HUE-STARTER-3', TRUE, FALSE, 4.50, 23450, 11230),

-- === BEDDING ===
(24, 'Wakefit Orthopedic Memory Foam Mattress (Queen, 6-inch)',
 'India''s most-loved mattress brand. The Wakefit Orthopedic mattress features high-density memory foam that conforms to your body shape, providing pressure point relief and optimal spinal alignment.',
 'Engineered with 2 inches of premium memory foam over 4 inches of high-resilience foam, the Wakefit mattress adapts to your sleeping position. The breathable outer cover keeps you cool throughout the night.',
 '["2-inch Memory Foam + 4-inch HR Foam construction", "Medium-firm feel for optimal spinal support", "Pressure point relief technology", "Breathable, anti-microbial zipper cover", "Zero partner disturbance with motion isolation", "100-night free trial, 10-year warranty", "Certified by CertiPUR-US and OEKO-TEX"]',
 'Wakefit', 33, 1, 8499.00, 14999.00, 43, 200, 'WF-ORTHO-MF-Q-6IN', TRUE, TRUE, 4.30, 89560, 42340),

-- === BOOKS ===
(25, 'Atomic Habits by James Clear (Paperback)',
 'The #1 New York Times bestseller. Tiny Changes, Remarkable Results. An Easy & Proven Way to Build Good Habits & Break Bad Ones. Over 15 million copies sold worldwide.',
 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
 '["#1 New York Times Bestseller with 15M+ copies sold", "Practical strategies for habit formation", "Covers the Four Laws of Behavior Change", "Backed by scientific research on psychology & neuroscience", "Includes real-world examples and actionable takeaways", "320 pages, Paperback edition", "Language: English, Publisher: Penguin Random House"]',
 'Penguin', 4, 1, 399.00, 799.00, 50, 1000, 'BOOK-ATOMIC-HABITS-PB', TRUE, TRUE, 4.70, 145670, 67890),

(26, 'The Psychology of Money by Morgan Housel (Paperback)',
 'Timeless lessons on wealth, greed, and happiness. Doing well with money isn''t necessarily about what you know. It''s about how you behave. And behavior is hard to teach, even to really smart people.',
 'In The Psychology of Money, Morgan Housel shares 19 short stories exploring the strange ways people think about money and teaches you how to make better sense of one of life''s most important topics.',
 '["19 short stories about the psychology of money", "International bestseller with 5M+ copies sold", "Explores wealth, greed, happiness, and financial decisions", "Easy to read, practical financial wisdom", "No prior finance knowledge required", "256 pages, Paperback edition", "Language: English, Publisher: Harriman House"]',
 'Harriman House', 4, 1, 349.00, 599.00, 42, 800, 'BOOK-PSYCH-MONEY-PB', TRUE, FALSE, 4.60, 98760, 43210),

(27, 'Ikigai: The Japanese Secret to a Long and Happy Life (Paperback)',
 'The international bestseller revealing the secrets of the world''s longest-living people. Discover your ikigai — your reason for being — and unlock a life of purpose, meaning, and joy.',
 'Based on research into the habits of the centenarians of Okinawa, Japan, this book reveals practical tips for finding your own ikigai. The key to a long and happy life may be simpler than you think.',
 '["International bestseller on Japanese philosophy of purpose", "Based on research from Okinawa, world''s Blue Zone", "Practical exercises to discover your ikigai", "Covers longevity, happiness, and meaningful living", "Easy read with actionable life philosophy", "208 pages, Paperback edition", "Language: English, Publisher: Hutchinson"]',
 'Hutchinson', 4, 1, 299.00, 499.00, 40, 600, 'BOOK-IKIGAI-PB', TRUE, FALSE, 4.40, 87650, 38900),

-- === BEAUTY & HEALTH ===
(28, 'Maybelline New York Fit Me Matte+Poreless Foundation (220 Natural Beige)',
 'Lightweight, breathable formula that mattifies skin and refines pores. Dermatologist tested. Allergy tested. Non-comedogenic. Available in 40 shades for every skin tone.',
 'The Fit Me Matte + Poreless Foundation is Maybelline''s #1 selling foundation worldwide. The micro-powders in the formula control shine and blur pores for a natural, seamless finish.',
 '["Matte finish that controls shine all day", "Blurs pores for smooth, flawless skin", "Lightweight, breathable formula", "Dermatologist tested, allergy tested", "Non-comedogenic, won''t clog pores", "Available in 40 shades for all skin tones", "SPF-free, perfect as makeup base"]',
 'Maybelline', 5, 2, 499.00, 699.00, 29, 500, 'MAYB-FITME-220-NB', TRUE, FALSE, 4.20, 56780, 24560),

(29, 'The Ordinary Niacinamide 10% + Zinc 1% Serum (30ml)',
 'High-strength vitamin and mineral formula to visibly reduce blemishes and congestion. A water-based serum that targets uneven skin tone, enlarged pores, and excess oil.',
 'This cult-favorite serum from The Ordinary contains a high 10% concentration of niacinamide (vitamin B3) supported by zinc salt to balance visible sebum activity. Clinically proven to reduce blemishes and brighten skin.',
 '["10% Niacinamide (Vitamin B3) concentration", "1% Zinc PCA for oil control", "Reduces blemishes and visible pores", "Improves uneven skin tone and texture", "Water-based, lightweight formula", "Vegan, cruelty-free, no parabens", "30ml bottle, use AM and PM after cleansing"]',
 'The Ordinary', 5, 2, 590.00, 690.00, 14, 300, 'TO-NIACIN-10-ZINC-30', TRUE, TRUE, 4.50, 34560, 15670),

-- === SPORTS & OUTDOORS ===
(30, 'Boldfit Resistance Bands Set of 5 (Light to Heavy)',
 'Complete resistance band set for full-body workouts. 5 color-coded bands from light to heavy resistance. Perfect for strength training, physical therapy, and home gym workouts.',
 'Whether you''re a beginner or an advanced athlete, this resistance band set provides versatile resistance for any exercise. Made from premium natural latex for durability and consistent resistance.',
 '["5 bands: Extra Light to Extra Heavy resistance", "Premium natural latex, non-snap construction", "Full-body workout: arms, legs, core, glutes", "Portable with carry bag for home or gym", "Color-coded for easy resistance identification", "Includes exercise guide booklet", "Perfect for rehabilitation and strength training"]',
 'Boldfit', 6, 2, 449.00, 1299.00, 65, 1000, 'BOLD-RESIST-5BAND', TRUE, FALSE, 4.30, 78900, 34560),

(31, 'Lifelong LLF45 Fit Pro Spin Fitness Bike (Home Gym)',
 'Premium spin bike with 6kg flywheel for smooth, quiet cycling experience. Adjustable resistance, comfortable seat, and LCD display tracking your workout stats. Perfect home cardio solution.',
 'The Lifelong Fit Pro brings the gym-quality spinning experience to your home. The heavy-duty steel frame supports up to 120kg while the adjustable seat and handlebars ensure perfect positioning.',
 '["6kg balanced flywheel for smooth operation", "Adjustable friction resistance system", "LCD Display: time, speed, distance, calories", "Adjustable seat height and handlebar position", "Max user weight: 120kg, sturdy steel frame", "Transport wheels for easy movement", "Belt-driven for quiet home use"]',
 'Lifelong', 6, 2, 7999.00, 14999.00, 47, 50, 'LL-LLF45-SPIN-BLK', TRUE, FALSE, 4.10, 12340, 5670),

-- === TOYS & GAMES ===
(32, 'LEGO Technic Lamborghini Sián FKP 37 (42115) - 3696 Pieces',
 'Build and display the legendary Lamborghini Sián FKP 37. This 1:8 scale model features a V12 engine with moving pistons, functional steering, and an 8-speed sequential gearbox. A true collector''s masterpiece.',
 'This LEGO Technic model brings the Lamborghini Sián FKP 37 to life in stunning detail. With 3,696 pieces and innovative building techniques, it''s one of the most complex and rewarding LEGO sets ever designed.',
 '["3696 pieces, 1:8 scale replica (60cm/23in long)", "Functional V12 engine with moving pistons", "8-speed sequential gearbox with 2 shift paddles", "Front and rear suspension, functional steering", "Opening doors, front hood, and rear bonnet", "Authentic lime green and black color scheme", "Includes display stand and collector''s booklet"]',
 'LEGO', 7, 1, 34999.00, 44999.00, 22, 15, 'LEGO-42115-LAMBO', TRUE, TRUE, 4.90, 4560, 2340),

-- === GROCERY / ESSENTIALS ===
(33, 'Tata Sampann Chana Dal (Unpolished, 1kg)',
 'Premium quality unpolished chana dal from Tata Sampann. High in protein and fiber, sourced from the best farms. No artificial polishing, preserving natural nutrients and goodness.',
 'Tata Sampann Chana Dal is carefully sourced and processed to retain its natural nutrients. The unpolished dal cooks evenly and has a rich, authentic taste that makes every meal wholesome.',
 '["100% unpolished, no artificial coloring", "Rich source of protein and dietary fiber", "Sourced from premium farms across India", "Cooks evenly with rich authentic taste", "No preservatives or additives", "1kg pack, resealable packaging", "FSSAI certified, Tata quality assurance"]',
 'Tata Sampann', 8, 1, 139.00, 170.00, 18, 2000, 'TATA-CHANA-1KG', TRUE, FALSE, 4.40, 23450, 10980),

-- === MORE ELECTRONICS ===
(34, 'JBL Charge 5 Portable Bluetooth Speaker (Blue)',
 'Bold JBL Original Pro Sound with powerful bass radiator. IP67 waterproof and dustproof. Built-in powerbank to charge your devices. Up to 20 hours of playtime.',
 'The JBL Charge 5 delivers bold, powerful audio with its optimized racetrack-shaped driver and dual passive bass radiators. Take it anywhere — the rugged design and IP67 rating make it adventure-proof.',
 '["JBL Original Pro Sound with deep bass", "IP67 Waterproof and Dustproof", "20 hours playtime, built-in 7500mAh powerbank", "PartyBoost: connect multiple JBL speakers", "Dual passive bass radiators for deep low end", "USB-C fast charging", "Durable fabric and rugged silicone housing"]',
 'JBL', 12, 1, 12999.00, 17999.00, 28, 180, 'JBL-CHARGE5-BLU', TRUE, FALSE, 4.50, 34560, 15670),

(35, 'Logitech MX Master 3S Wireless Mouse (Graphite)',
 'The master series of mice, perfected. Featuring an 8000 DPI sensor, quiet clicks, and MagSpeed electromagnetic scrolling. Works on virtually any surface including glass.',
 'Designed for power users, the MX Master 3S offers precision tracking, comfortable ergonomic design, and seamless multi-device workflow. The 8K DPI sensor works on any surface, even glass.',
 '["8000 DPI sensor tracks on any surface including glass", "MagSpeed scroll: 1000 lines per second, precise", "Quiet Clicks: 90% less click noise", "Ergonomic shape sculpted for right hand", "USB-C quick charging: 3 hours = 70 days use", "Flow: seamless control across 3 computers", "Works with macOS, Windows, Linux, iPadOS"]',
 'Logitech', 1, 1, 8995.00, 10995.00, 18, 200, 'LOGI-MXM3S-GRAPH', TRUE, FALSE, 4.60, 19870, 8760),

(36, 'Samsung 55-inch Crystal 4K UHD Smart TV (UA55CUE60AKLXL)',
 'Experience stunning 4K resolution with Samsung''s Crystal Processor 4K. PurColor technology delivers lifelike colors across a wider spectrum. Smart TV powered by Tizen OS with OTT apps built-in.',
 'The Samsung Crystal 4K UHD TV brings vivid, crystal-clear picture quality to your living room. The slim bezel design maximizes your viewing area, while the Crystal Processor 4K upscales content for a stunning visual experience.',
 '["55-inch 4K UHD (3840x2160) LED Display", "Crystal Processor 4K for vivid clarity", "PurColor technology for lifelike color spectrum", "HDR10+ for stunning contrast and brightness", "Smart TV: Netflix, Prime, Disney+, YouTube built-in", "20W speakers with Adaptive Sound", "3 HDMI, 1 USB, WiFi, Bluetooth, AirSlim design"]',
 'Samsung', 1, 1, 44990.00, 64900.00, 31, 60, 'SAM-55CUE60-4K', TRUE, TRUE, 4.30, 28760, 13450),

-- === MORE FASHION ===
(37, 'Ray-Ban Aviator Classic Sunglasses (Gold Frame, Green Lens)',
 'The iconic Ray-Ban Aviator. Originally designed for U.S. aviators in 1937, the Aviator Classic has become one of the most recognizable sunglasses in the world. Timeless style, superior quality.',
 'Crafted with a gold-tone metal frame and crystal green G-15 lenses that provide true color perception. The Aviator Classic features a teardrop shape that suits most face shapes and offers 100% UV protection.',
 '["Iconic teardrop Aviator shape since 1937", "Crystal green G-15 lenses for true color perception", "100% UV protection (UVA and UVB rays)", "Gold-tone metal frame with adjustable nose pads", "Lens width: 58mm, bridge: 14mm, temple: 135mm", "Includes Ray-Ban case and cleaning cloth", "Made in Italy, authentic Ray-Ban quality"]',
 'Ray-Ban', 2, 2, 6990.00, 9490.00, 26, 250, 'RB-AVIATOR-GOLD-GRN', TRUE, TRUE, 4.60, 45670, 21340),

(38, 'U.S. Polo Assn. Men''s Regular Fit Polo T-Shirt (Navy Blue)',
 'Classic polo t-shirt in premium cotton pique. Features the iconic USPA logo embroidery. Perfect for casual outings and smart-casual occasions.',
 'This U.S. Polo Assn. polo combines timeless design with comfortable fit. The 100% cotton pique fabric is breathable and soft against the skin, while the ribbed collar and cuffs maintain their shape.',
 '["100% Premium Cotton Pique fabric", "Regular fit for comfortable everyday wear", "Ribbed collar and cuff for shape retention", "Two-button placket with genuine USPA buttons", "Embroidered U.S. Polo Assn. logo", "Pre-shrunk, machine washable", "Available in S, M, L, XL, XXL"]',
 'U.S. Polo Assn.', 20, 2, 1199.00, 1899.00, 37, 600, 'USPA-POLO-REG-NVY', TRUE, FALSE, 4.20, 67890, 29870),

-- === HOME & KITCHEN ===
(39, 'Prestige Iris 750 Watt Mixer Grinder (3 Jars, White/Purple)',
 'Powerful 750-watt copper motor mixer grinder with 3 stainless steel jars. Perfect for grinding, blending, and making chutneys. The unbreakable polycarbonate lids ensure safe operation.',
 'The Prestige Iris brings reliability to your kitchen with its powerful 750W motor and 3 versatile jars. The stainless steel blades deliver consistent results whether grinding masalas or blending smoothies.',
 '["750W powerful copper motor for efficient grinding", "3 Stainless Steel Jars: 1.5L, 1.0L, 0.5L", "Super sharp stainless steel blades", "Unbreakable polycarbonate lids", "3-speed control with pulse function", "Anti-skid feet for stability", "2-year manufacturer warranty"]',
 'Prestige', 31, 1, 2699.00, 4195.00, 36, 300, 'PRES-IRIS-750W-3J', TRUE, FALSE, 4.10, 34560, 15670),

(40, 'Borosil 5L Stainless Steel Insulated Casserole (Silver)',
 'Keep your food warm for up to 8 hours with Borosil''s premium insulated casserole. The double-wall stainless steel construction locks in heat while the elegant design complements any dining table.',
 'The Borosil insulated casserole features vacuum insulation technology that keeps food hot for up to 8 hours. The food-grade stainless steel interior is easy to clean and maintains food hygiene.',
 '["5-liter capacity, ideal for family meals", "Double-wall vacuum insulation, 8+ hours warm", "Food-grade 304 stainless steel interior", "Elegant mirror-finish exterior", "Cool-touch handles for safe serving", "BPA-free, dishwasher safe inner container", "5-year warranty on insulation performance"]',
 'Borosil', 31, 1, 1899.00, 3499.00, 46, 150, 'BORO-CASS-5L-SLVR', TRUE, FALSE, 4.40, 23450, 10980),

-- === MORE PRODUCTS TO REACH 50+ ===
(41, 'Boat Airdopes 141 TWS Earbuds (Black)',
 'Immerse in powerful audio with boAt Airdopes 141. Featuring 8mm drivers, ENx technology for clear calls, 42 hours total playback, and IPX4 water resistance. India''s #1 audio wearable brand.',
 'boAt Airdopes 141 delivers punchy audio with 8mm drivers and boAt Signature Sound. The lightweight design and IWP technology make them perfect for all-day comfortable listening.',
 '["8mm drivers with boAt Signature Sound", "ENx Environmental Noise Cancellation for calls", "42 hours total playback with charging case", "IPX4 water and sweat resistant", "Bluetooth v5.3 for stable connectivity", "IWP: Instant Wake & Pair technology", "Lightweight 4g per earbud, comfortable fit"]',
 'boAt', 12, 1, 1299.00, 4490.00, 71, 500, 'BOAT-AD141-BLK', TRUE, TRUE, 4.10, 123450, 56780),

(42, 'Philips BHH880/10 Hair Straightener Brush (Black)',
 'Straighten your hair in half the time with the Philips StyleCare heated straightening brush. ThermoProtect technology provides constant caring temperature to prevent overheating.',
 'The Philips Hair Straightening Brush combines the ease of a brush with the power of a straightener. The natural bristle and heated plate design detangles and straightens in one stroke.',
 '["ThermoProtect technology prevents overheating", "Ionic conditioning for frizz-free results", "Heats up in 50 seconds, 170°C optimal temp", "Natural bristle and heated plate design", "Keratin-infused ceramic coating plates", "Swivel cord for easy maneuverability", "Auto shut-off after 60 minutes"]',
 'Philips', 5, 1, 2149.00, 2995.00, 28, 200, 'PHI-BHH880-BRUSH', TRUE, FALSE, 4.30, 45670, 19870),

(43, 'Samsung Galaxy Buds FE (Graphite)',
 'Immersive sound with Active Noise Cancellation. Powered by AKG. 3 microphones with AI-based solution for crystal clear calls. 30 hours total battery life with charging case.',
 'Galaxy Buds FE deliver premium AKG-tuned sound with Active Noise Cancellation at an accessible price. The comfortable fit, long battery life, and seamless Galaxy ecosystem integration make them ideal daily earbuds.',
 '["Active Noise Cancellation with Ambient Sound", "AKG-tuned sound with deep bass", "3 mics with AI noise reduction for calls", "6.5 hours playback + 23.5 hours with case", "IPX2 water resistance", "Touch controls for music and calls", "Seamless pairing with Galaxy devices"]',
 'Samsung', 12, 1, 4999.00, 6999.00, 29, 250, 'SAM-BUDS-FE-GRAPH', TRUE, FALSE, 4.30, 28760, 12340),

(44, 'HP 15s-fq5007TU Laptop (12th Gen Intel i5, 8GB, 512GB, 15.6")',
 'Everyday computing made powerful. The HP 15s features 12th Gen Intel Core i5 processor, 8GB DDR4 RAM, and 512GB SSD for smooth multitasking. The 15.6-inch FHD anti-glare display is easy on the eyes.',
 'Perfect for students and professionals, the HP 15s combines reliable performance with a sleek, lightweight design. The micro-edge display maximizes viewing area while the dual speakers provide immersive audio.',
 '["12th Gen Intel Core i5-1235U Processor (10 cores)", "8GB DDR4-3200 RAM, expandable to 16GB", "512GB PCIe NVMe M.2 SSD", "15.6-inch FHD (1920x1080) Anti-Glare IPS Display", "Intel Iris Xe Graphics", "Dual speakers, HD webcam with mic", "Windows 11 Home, up to 8hr battery, 1.69kg"]',
 'HP', 11, 1, 52990.00, 66542.00, 20, 80, 'HP-15S-I5-512-SLV', TRUE, FALSE, 4.20, 34560, 15670),

(45, 'Titan Raga Viva Analog Women''s Watch (Rose Gold)',
 'Elegant and modern, the Titan Raga Viva watch features a rose gold metal bracelet and refined dial design. Water resistant and powered by a reliable quartz movement.',
 'The Raga Viva collection from Titan celebrates the modern Indian woman. The rose gold finish, delicate dial markers, and comfortable metal bracelet make it a versatile accessory for any occasion.',
 '["Rose gold stainless steel bracelet", "Refined analog dial with crystal markers", "Japanese quartz movement for accuracy", "30-meter water resistance", "Fold-over clasp with safety closure", "Case diameter: 28mm, slim profile", "2-year Titan warranty"]',
 'Titan', 23, 2, 3995.00, 5495.00, 27, 100, 'TITAN-RAGA-VIVA-RG', TRUE, FALSE, 4.40, 12340, 5670),

(46, 'Himalaya Neem Face Wash (200ml)',
 'Soap-free, herbal face wash with Neem and Turmeric. Gently cleanses impurities, excess oil, and helps prevent pimples. Suitable for normal to oily skin.',
 'Himalaya''s Neem Face Wash is a soap-free formula enriched with Neem and Turmeric that purifies skin without stripping natural moisture. Dermatologically tested and gentle enough for daily use.',
 '["Soap-free herbal formulation", "Neem: antibacterial, prevents pimples", "Turmeric: anti-inflammatory, controls oil", "Removes impurities without over-drying", "For normal to oily skin types", "Dermatologically tested, gentle daily use", "200ml bottle, 3-4 months supply"]',
 'Himalaya', 5, 2, 180.00, 225.00, 20, 1500, 'HIM-NEEM-FW-200', TRUE, FALSE, 4.30, 156780, 67890),

(47, 'Wildcraft Unisex Hiking Shoes (Grey/Orange)',
 'Trek-ready hiking shoes with superior grip and ankle support. Water-resistant upper, EVA midsole for cushioning, and aggressive rubber outsole for all terrain performance.',
 'Wildcraft Hiking Shoes are built for the Indian outdoors. The reinforced toe cap protects against rocks, the water-resistant upper keeps feet dry, and the lugged outsole provides reliable traction on wet and dry surfaces.',
 '["Water-resistant synthetic mesh upper", "EVA midsole for lightweight cushioning", "Aggressive rubber outsole for all-terrain grip", "Reinforced toe cap for protection", "Padded collar and tongue for comfort", "Speed lacing system for quick fit", "Available in UK sizes 6-11"]',
 'Wildcraft', 22, 2, 2999.00, 4999.00, 40, 200, 'WC-HIKE-GRY-ORG', TRUE, FALSE, 4.10, 8760, 3450),

(48, 'Kindle Paperwhite (16GB, 6.8-inch, Black)',
 'The thinnest, lightest Kindle Paperwhite yet. With a 6.8-inch glare-free display, adjustable warm light, and up to 10 weeks of battery life. IPX8 waterproof for worry-free reading.',
 'The all-new Kindle Paperwhite features a larger 6.8-inch display and thinner borders for more reading area. The adjustable warm light lets you shift screen shade from white to amber for comfortable reading day and night.',
 '["6.8-inch glare-free, 300ppi Paperwhite display", "Adjustable warm light for day and night reading", "Up to 10 weeks battery life on single charge", "16GB storage for thousands of books", "IPX8 waterproof - read in bath or pool", "20% faster page turns than previous gen", "USB-C charging, audible via Bluetooth"]',
 'Amazon', 14, 1, 14999.00, 16999.00, 12, 300, 'KINDLE-PW-16GB-BLK', TRUE, TRUE, 4.70, 67890, 34560),

(49, 'Pigeon by Stovekraft Favourite Outer Lid Pressure Cooker (5L, Silver)',
 'India''s trusted pressure cooker brand. 5-liter capacity ideal for families of 4-6. ISI certified with multiple safety mechanisms. Heavy gauge aluminum for uniform heat distribution.',
 'The Pigeon Favourite pressure cooker is built for everyday Indian cooking. The heavy gauge aluminum body distributes heat evenly, while the precision weight valve ensures safe and efficient pressure cooking.',
 '["5-liter capacity for families of 4-6", "ISI certified (IS:2347) for safety assurance", "Heavy gauge virgin aluminum for even heating", "Metallic safety plug for extra protection", "Precision weight valve for consistent pressure", "Gasket release system prevents accidents", "Induction compatible, 5-year warranty"]',
 'Pigeon', 31, 1, 899.00, 1645.00, 45, 800, 'PIG-FAV-PC-5L-SLV', TRUE, FALSE, 4.20, 89560, 42340),

(50, 'Havells Pacer 1200mm Ceiling Fan (White)',
 'Energy-efficient ceiling fan with powerful air delivery. The aerodynamically designed blades ensure maximum air thrust. Silent operation with double ball bearings. ISI certified.',
 'The Havells Pacer ceiling fan combines performance with energy efficiency. The 1200mm sweep and aerodynamic blade design deliver wide air coverage, while the powder-coated finish resists rust and corrosion.',
 '["1200mm (48-inch) sweep for wide coverage", "Aerodynamic blade design for high air delivery", "Double ball bearings for silent operation", "Powder-coated finish for rust resistance", "Energy efficient: consumes only 75W", "ISI certified (IS:374), safe and reliable", "2-year manufacturer warranty, easy installation"]',
 'Havells', 3, 1, 1399.00, 2050.00, 32, 400, 'HAV-PACER-1200-WHT', TRUE, FALSE, 4.30, 45670, 19870),

(51, 'Sony PlayStation 5 (PS5) Console - Disc Edition',
 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.',
 'The PS5 console unleashes new gaming possibilities that you never anticipated. Experience lightning-fast loading, stunning 4K graphics, and immersive audio with Tempest 3D AudioTech.',
 '["Custom AMD Zen 2, 8-core 3.5GHz CPU", "10.28 TFLOPS, Custom RDNA 2 GPU", "825GB Custom SSD with 5.5GB/s read speed", "4K-TV gaming up to 120fps, HDR support", "Ray Tracing for lifelike visuals", "Haptic feedback and adaptive triggers on DualSense", "Backward compatible with PS4 games"]',
 'Sony', 1, 1, 49990.00, 54990.00, 9, 40, 'SONY-PS5-DISC', TRUE, TRUE, 4.80, 45670, 21340),

(52, 'Bombay Shaving Company Beard Grooming Kit (6-in-1)',
 'Complete beard grooming solution with beard oil, wash, wax, comb, trimming scissors, and carry pouch. Premium ingredients for a well-maintained, healthy beard.',
 'The Bombay Shaving Company 6-in-1 Beard Kit has everything you need for the perfect beard. From cleansing to styling, each product is crafted with premium natural ingredients.',
 '["6-in-1 kit: Oil, Wash, Wax, Comb, Scissors, Pouch", "Beard Oil with Argan Oil and Jojoba", "SLS-free Beard Wash for gentle cleansing", "Strong hold Beard Wax for styling", "Handcrafted wooden comb, premium scissors", "Premium gift-ready packaging", "Suitable for all beard types and lengths"]',
 'Bombay Shaving Company', 5, 2, 899.00, 1999.00, 55, 300, 'BSC-BEARD-KIT-6IN1', TRUE, FALSE, 4.30, 23450, 10980);

-- ──────────────────────────────────────
-- PRODUCT IMAGES (using placeholder URLs)
-- ──────────────────────────────────────
INSERT IGNORE INTO product_images (product_id, image_url, is_primary, sort_order) VALUES
(1, 'https://placehold.co/600x600/232F3E/FF9900?text=Galaxy+S24+Ultra', TRUE, 1),
(1, 'https://placehold.co/600x600/232F3E/FFFFFF?text=S24+Ultra+Back', FALSE, 2),
(1, 'https://placehold.co/600x600/232F3E/FFFFFF?text=S24+Ultra+Side', FALSE, 3),
(2, 'https://placehold.co/600x600/F5F5F5/333333?text=iPhone+15+Pro+Max', TRUE, 1),
(2, 'https://placehold.co/600x600/F5F5F5/333333?text=iPhone+15+Back', FALSE, 2),
(3, 'https://placehold.co/600x600/004D40/FFFFFF?text=OnePlus+12', TRUE, 1),
(4, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Pixel+8+Pro', TRUE, 1),
(5, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Xiaomi+14+Ultra', TRUE, 1),
(6, 'https://placehold.co/600x600/1A1A2E/FFFFFF?text=MacBook+Air+M3', TRUE, 1),
(6, 'https://placehold.co/600x600/1A1A2E/FFFFFF?text=MacBook+Open', FALSE, 2),
(7, 'https://placehold.co/600x600/1A1A1A/FF0000?text=ROG+Strix+G16', TRUE, 1),
(8, 'https://placehold.co/600x600/2D2D2D/FFFFFF?text=ThinkPad+X1', TRUE, 1),
(9, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Sony+WH-1000XM5', TRUE, 1),
(10, 'https://placehold.co/600x600/F5F5F5/333333?text=AirPods+Pro+2', TRUE, 1),
(11, 'https://placehold.co/600x600/2D2D2D/FFFFFF?text=Sony+A7+IV', TRUE, 1),
(12, 'https://placehold.co/600x600/E8E8E8/333333?text=iPad+Air+M2', TRUE, 1),
(13, 'https://placehold.co/600x600/1A1A2E/FFFFFF?text=Apple+Watch+S9', TRUE, 1),
(14, 'https://placehold.co/600x600/1A237E/FFFFFF?text=Levi%27s+511', TRUE, 1),
(15, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Nike+Dri-FIT', TRUE, 1),
(16, 'https://placehold.co/600x600/004D40/FFFFFF?text=ZARA+Satin+Dress', TRUE, 1),
(17, 'https://placehold.co/600x600/F5F5F5/333333?text=Air+Max+270', TRUE, 1),
(18, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Ultraboost+23', TRUE, 1),
(19, 'https://placehold.co/600x600/8D6E63/FFFFFF?text=Fossil+Gen+6', TRUE, 1),
(20, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=AT+Backpack', TRUE, 1),
(21, 'https://placehold.co/600x600/F5F5F5/333333?text=IKEA+KALLAX', TRUE, 1),
(22, 'https://placehold.co/600x600/C62828/FFFFFF?text=Instant+Pot', TRUE, 1),
(23, 'https://placehold.co/600x600/1565C0/FFFFFF?text=Philips+Hue', TRUE, 1),
(24, 'https://placehold.co/600x600/F5F5F5/333333?text=Wakefit+Mattress', TRUE, 1),
(25, 'https://placehold.co/600x600/FFF8E1/333333?text=Atomic+Habits', TRUE, 1),
(26, 'https://placehold.co/600x600/E8EAF6/333333?text=Psychology+Money', TRUE, 1),
(27, 'https://placehold.co/600x600/FFF3E0/333333?text=Ikigai', TRUE, 1),
(28, 'https://placehold.co/600x600/F8BBD0/333333?text=Maybelline+FitMe', TRUE, 1),
(29, 'https://placehold.co/600x600/F5F5F5/333333?text=The+Ordinary', TRUE, 1),
(30, 'https://placehold.co/600x600/FF6F00/FFFFFF?text=Resistance+Bands', TRUE, 1),
(31, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Spin+Bike', TRUE, 1),
(32, 'https://placehold.co/600x600/FFD600/333333?text=LEGO+Lambo', TRUE, 1),
(33, 'https://placehold.co/600x600/FFF8E1/333333?text=Tata+Chana+Dal', TRUE, 1),
(34, 'https://placehold.co/600x600/1565C0/FFFFFF?text=JBL+Charge+5', TRUE, 1),
(35, 'https://placehold.co/600x600/424242/FFFFFF?text=MX+Master+3S', TRUE, 1),
(36, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Samsung+55+4K+TV', TRUE, 1),
(37, 'https://placehold.co/600x600/FFD54F/333333?text=Ray-Ban+Aviator', TRUE, 1),
(38, 'https://placehold.co/600x600/1A237E/FFFFFF?text=USPA+Polo', TRUE, 1),
(39, 'https://placehold.co/600x600/7B1FA2/FFFFFF?text=Prestige+Mixer', TRUE, 1),
(40, 'https://placehold.co/600x600/BDBDBD/333333?text=Borosil+5L', TRUE, 1),
(41, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=boAt+Airdopes', TRUE, 1),
(42, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Philips+Brush', TRUE, 1),
(43, 'https://placehold.co/600x600/424242/FFFFFF?text=Galaxy+Buds+FE', TRUE, 1),
(44, 'https://placehold.co/600x600/E0E0E0/333333?text=HP+15s+Laptop', TRUE, 1),
(45, 'https://placehold.co/600x600/FFCCBC/333333?text=Titan+Raga', TRUE, 1),
(46, 'https://placehold.co/600x600/C8E6C9/333333?text=Himalaya+Neem', TRUE, 1),
(47, 'https://placehold.co/600x600/BDBDBD/333333?text=Wildcraft+Shoes', TRUE, 1),
(48, 'https://placehold.co/600x600/1A1A1A/FFFFFF?text=Kindle+Paperwhite', TRUE, 1),
(49, 'https://placehold.co/600x600/BDBDBD/333333?text=Pigeon+Cooker', TRUE, 1),
(50, 'https://placehold.co/600x600/F5F5F5/333333?text=Havells+Fan', TRUE, 1),
(51, 'https://placehold.co/600x600/003087/FFFFFF?text=PS5+Console', TRUE, 1),
(52, 'https://placehold.co/600x600/3E2723/FFD54F?text=BSC+Beard+Kit', TRUE, 1);

-- ──────────────────────────────────────
-- PRODUCT VARIANTS (selected products)
-- ──────────────────────────────────────
INSERT IGNORE INTO product_variants (product_id, variant_name, color, size, storage, price_modifier, stock, sku_variant) VALUES
-- Samsung S24 Ultra variants
(1, 'Titanium Gray 256GB', 'Titanium Gray', NULL, '256GB', 0.00, 100, 'SAM-S24U-256-GRY'),
(1, 'Titanium Black 512GB', 'Titanium Black', NULL, '512GB', 10000.00, 80, 'SAM-S24U-512-BLK'),
(1, 'Titanium Violet 256GB', 'Titanium Violet', NULL, '256GB', 0.00, 60, 'SAM-S24U-256-VIO'),
-- iPhone 15 Pro Max variants
(2, 'Blue Titanium 256GB', 'Blue Titanium', NULL, '256GB', 0.00, 120, 'APL-IP15PM-256-BLU'),
(2, 'Natural Titanium 512GB', 'Natural Titanium', NULL, '512GB', 20000.00, 60, 'APL-IP15PM-512-TIT'),
(2, 'Black Titanium 1TB', 'Black Titanium', NULL, '1TB', 40000.00, 30, 'APL-IP15PM-1TB-BLK'),
-- Levi's 511 variants
(14, '30x32 Dark Blue', 'Dark Blue', '30x32', NULL, 0.00, 100, 'LEV-511-DB-30'),
(14, '32x32 Dark Blue', 'Dark Blue', '32x32', NULL, 0.00, 120, 'LEV-511-DB-32'),
(14, '34x32 Dark Blue', 'Dark Blue', '34x32', NULL, 0.00, 80, 'LEV-511-DB-34'),
(14, '32x32 Light Blue', 'Light Blue', '32x32', NULL, 200.00, 90, 'LEV-511-LB-32'),
-- Nike T-Shirt variants
(15, 'Black Small', 'Black', 'S', NULL, 0.00, 150, 'NIKE-DRI-BLK-S'),
(15, 'Black Medium', 'Black', 'M', NULL, 0.00, 200, 'NIKE-DRI-BLK-M'),
(15, 'Black Large', 'Black', 'L', NULL, 0.00, 180, 'NIKE-DRI-BLK-L'),
(15, 'White Medium', 'White', 'M', NULL, 0.00, 150, 'NIKE-DRI-WHT-M'),
-- ZARA Dress variants
(16, 'Emerald Green S', 'Emerald Green', 'S', NULL, 0.00, 50, 'ZARA-SAT-GRN-S'),
(16, 'Emerald Green M', 'Emerald Green', 'M', NULL, 0.00, 60, 'ZARA-SAT-GRN-M'),
(16, 'Black M', 'Black', 'M', NULL, 0.00, 70, 'ZARA-SAT-BLK-M'),
-- Nike Air Max 270 variants
(17, 'White/Black US 8', 'White/Black', 'US 8', NULL, 0.00, 30, 'NIKE-AM270-WB-8'),
(17, 'White/Black US 9', 'White/Black', 'US 9', NULL, 0.00, 35, 'NIKE-AM270-WB-9'),
(17, 'White/Black US 10', 'White/Black', 'US 10', NULL, 0.00, 25, 'NIKE-AM270-WB-10'),
-- Sony WH-1000XM5 variants
(9, 'Black', 'Black', NULL, NULL, 0.00, 100, 'SONY-XM5-BLK'),
(9, 'Silver', 'Silver', NULL, NULL, 0.00, 80, 'SONY-XM5-SLV'),
(9, 'Midnight Blue', 'Midnight Blue', NULL, NULL, 500.00, 50, 'SONY-XM5-BLU');

-- ──────────────────────────────────────
-- SAMPLE REVIEWS
-- ──────────────────────────────────────
INSERT IGNORE INTO product_ratings (product_id, user_id, rating, review_title, review_body, verified_purchase, helpful_votes) VALUES
(1, 2, 5, 'Best smartphone I have ever used!', 'The Galaxy S24 Ultra is absolutely stunning. The camera quality is insane, especially the 200MP main sensor. The S Pen is super responsive and the AI features are genuinely useful. Battery easily lasts a full day with heavy usage. The titanium build feels premium and durable. Worth every penny!', TRUE, 234),
(2, 2, 5, 'Apple at its finest', 'iPhone 15 Pro Max is the perfect phone. The titanium design is gorgeous and lighter than expected. Camera system is incredible - the 5x zoom is game-changing. A17 Pro chip handles everything I throw at it. Action button is surprisingly useful. Only wish they had faster charging.', TRUE, 189),
(6, 2, 5, 'Incredible performance in a thin package', 'The M3 MacBook Air 15-inch is phenomenal. Coming from an Intel MacBook, the difference is night and day. Everything is instant, battery lasts 14+ hours of real usage, and it stays completely silent. The 15-inch screen is perfect for productivity. Best laptop I have owned.', TRUE, 156),
(9, 2, 5, 'Noise cancellation king', 'The Sony WH-1000XM5 lives up to the hype. Noise cancellation is the best in class - it blocks out airplane noise completely. Sound quality is rich and detailed. The lightweight design means I can wear them for hours without discomfort. Multipoint Bluetooth is a game changer for switching between phone and laptop.', TRUE, 312),
(25, 2, 5, 'Life-changing book', 'Atomic Habits is one of those rare books that actually changes your behavior. James Clear breaks down habit formation into simple, actionable steps. The 1% improvement concept is powerful and motivating. I have already started implementing the habit stacking technique. Must-read for everyone.', TRUE, 567);

-- ──────────────────────────────────────
-- COUPONS
-- ──────────────────────────────────────
INSERT IGNORE INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, valid_from, valid_to, is_active) VALUES
('WELCOME10', 'Get 10% off on your first order', 'PERCENT', 10.00, 500.00, 500.00, 10000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('FLAT200', 'Flat ₹200 off on orders above ₹1500', 'FLAT', 200.00, 1500.00, 200.00, 5000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('ELECTRONICS15', '15% off on all electronics', 'PERCENT', 15.00, 5000.00, 3000.00, 2000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('FASHION25', '25% off on fashion products', 'PERCENT', 25.00, 1000.00, 1000.00, 3000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('NEWUSER500', 'Flat ₹500 off for new users', 'FLAT', 500.00, 2000.00, 500.00, 50000, '2024-01-01 00:00:00', '2025-12-31 23:59:59', TRUE);
