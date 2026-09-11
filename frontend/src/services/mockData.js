// ═══════════════════════════════════════════════════
// Amazon Clone — Mock Data (Standalone Demo Mode)
// ═══════════════════════════════════════════════════

const IMG = (label, w = 400, h = 400, bg = '232f3e', fg = 'ff9900') => `https://placehold.co/${w}x${h}/${bg}/${fg}?text=${encodeURIComponent(label)}`;
const CATIMG = (label) => `https://placehold.co/300x200/232f3e/ff9900?text=${encodeURIComponent(label)}`;

// ── Categories ──
export const categories = [
  { id: 1, name: 'Electronics', slug: 'electronics', description: 'Smartphones, Laptops, Cameras & more', imageUrl: CATIMG('Electronics'), isActive: true, sortOrder: 1, parentId: null },
  { id: 2, name: 'Fashion', slug: 'fashion', description: 'Clothing, Footwear, Watches & Accessories', imageUrl: CATIMG('Fashion'), isActive: true, sortOrder: 2, parentId: null },
  { id: 3, name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Furniture, Decor, Kitchen Appliances', imageUrl: CATIMG('Home+Kitchen'), isActive: true, sortOrder: 3, parentId: null },
  { id: 4, name: 'Books', slug: 'books', description: 'Fiction, Non-Fiction, Textbooks & more', imageUrl: CATIMG('Books'), isActive: true, sortOrder: 4, parentId: null },
  { id: 5, name: 'Beauty & Health', slug: 'beauty-health', description: 'Skincare, Makeup, Wellness Products', imageUrl: CATIMG('Beauty'), isActive: true, sortOrder: 5, parentId: null },
  { id: 6, name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Fitness, Camping, Sports Equipment', imageUrl: CATIMG('Sports'), isActive: true, sortOrder: 6, parentId: null },
  { id: 7, name: 'Toys & Games', slug: 'toys-games', description: 'Educational Toys, Board Games, Action Figures', imageUrl: CATIMG('Toys'), isActive: true, sortOrder: 7, parentId: null },
  { id: 8, name: 'Grocery', slug: 'grocery', description: 'Daily Essentials, Snacks, Beverages', imageUrl: CATIMG('Grocery'), isActive: true, sortOrder: 8, parentId: null },
];

// ── Products ──
export const products = [
  // Electronics
  { id: 1, title: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)', brand: 'Samsung', categoryId: 1, price: 129999, mrp: 149999, discountPercent: 13, avgRating: 4.5, totalRatings: 12450, primaryImage: IMG(160), stockQuantity: 50, inStock: true, isFeatured: true, isDealOfDay: true, description: 'The ultimate Galaxy experience with built-in S Pen, 200MP camera, and titanium frame.', bulletPoints: ['200MP Adaptive Pixel camera', '6.8" Dynamic AMOLED 2X display', 'Snapdragon 8 Gen 3 processor', '5000mAh battery with 45W fast charging', 'Built-in S Pen with AI features'], images: [{ imageUrl: IMG(160) }, { imageUrl: IMG(180) }, { imageUrl: IMG(119) }], seller: { businessName: 'TechVault India' }, variants: [{ id: 1, variantName: '256GB' }, { id: 2, variantName: '512GB' }, { id: 3, variantName: '1TB' }] },
  { id: 2, title: 'Apple MacBook Air M3 (15-inch, 16GB RAM, 512GB SSD)', brand: 'Apple', categoryId: 1, price: 149900, mrp: 164900, discountPercent: 9, avgRating: 4.7, totalRatings: 5680, primaryImage: IMG(48), stockQuantity: 25, inStock: true, isFeatured: true, isDealOfDay: false, description: 'Supercharged by M3 chip. Up to 18 hours of battery life.', bulletPoints: ['M3 chip with 10-core GPU', '15.3" Liquid Retina display', '16GB unified memory', '512GB SSD storage', 'Up to 18 hours battery life'], images: [{ imageUrl: IMG(48) }, { imageUrl: IMG(2) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 3, title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', brand: 'Sony', categoryId: 1, price: 26990, mrp: 34990, discountPercent: 23, avgRating: 4.6, totalRatings: 8923, primaryImage: IMG(367), stockQuantity: 100, inStock: true, isFeatured: true, isDealOfDay: true, description: 'Industry-leading noise cancellation with exceptional sound quality.', bulletPoints: ['Industry-leading noise cancellation', '30-hour battery life', 'Crystal clear hands-free calling', 'Multipoint connection', 'Speak-to-Chat technology'], images: [{ imageUrl: IMG(367) }], seller: { businessName: 'TechVault India' }, variants: [{ id: 4, variantName: 'Black' }, { id: 5, variantName: 'Silver' }] },
  { id: 4, title: 'Apple iPad Air M2 (11-inch, Wi-Fi, 256GB)', brand: 'Apple', categoryId: 1, price: 69900, mrp: 79900, discountPercent: 13, avgRating: 4.8, totalRatings: 3200, primaryImage: IMG(403), stockQuantity: 35, inStock: true, isFeatured: false, isDealOfDay: false, description: 'Powerful M2 chip, stunning Liquid Retina display.', bulletPoints: ['M2 chip', '11" Liquid Retina display', 'Apple Pencil Pro compatible', 'Wi-Fi 6E', '256GB storage'], images: [{ imageUrl: IMG(403) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 5, title: 'JBL Charge 5 Portable Bluetooth Speaker', brand: 'JBL', categoryId: 1, price: 13999, mrp: 18999, discountPercent: 26, avgRating: 4.4, totalRatings: 15670, primaryImage: IMG(599), stockQuantity: 200, inStock: true, isFeatured: false, isDealOfDay: true, description: 'Powerful JBL Original Pro Sound with IP67 waterproof design.', bulletPoints: ['20 hours playtime', 'IP67 waterproof & dustproof', 'Built-in powerbank', 'PartyBoost', 'JBL Pro Sound'], images: [{ imageUrl: IMG(599) }], seller: { businessName: 'TechVault India' }, variants: [] },

  // Fashion
  { id: 6, title: 'Levi\'s Men\'s 511 Slim Fit Jeans (Dark Indigo Wash)', brand: 'Levi\'s', categoryId: 2, price: 2499, mrp: 4999, discountPercent: 50, avgRating: 4.3, totalRatings: 23400, primaryImage: IMG(996), stockQuantity: 300, inStock: true, isFeatured: true, isDealOfDay: true, description: 'Classic slim fit jeans with modern stretch for comfort.', bulletPoints: ['Slim fit through hip and thigh', 'Sits below waist', 'Stretch denim', 'Machine washable', '5-pocket styling'], images: [{ imageUrl: IMG(996) }], seller: { businessName: 'FashionHub Store' }, variants: [{ id: 6, size: '30' }, { id: 7, size: '32' }, { id: 8, size: '34' }] },
  { id: 7, title: 'Nike Air Max 270 React Running Shoes (Black/White)', brand: 'Nike', categoryId: 2, price: 8995, mrp: 13995, discountPercent: 36, avgRating: 4.5, totalRatings: 18200, primaryImage: IMG(21), stockQuantity: 150, inStock: true, isFeatured: true, isDealOfDay: false, description: 'The first-ever Max Air unit designed for Nike Sportswear.', bulletPoints: ['React foam midsole', 'Max Air 270 unit', 'Breathable mesh upper', 'Rubber outsole', 'Pull tab on heel'], images: [{ imageUrl: IMG(21) }], seller: { businessName: 'FashionHub Store' }, variants: [] },
  { id: 8, title: 'Raymond Slim Fit Formal Shirt (White, Cotton)', brand: 'Raymond', categoryId: 2, price: 1299, mrp: 2599, discountPercent: 50, avgRating: 4.2, totalRatings: 9800, primaryImage: IMG(669), stockQuantity: 250, inStock: true, isFeatured: false, isDealOfDay: true, description: 'Premium cotton formal shirt with a perfect slim fit.', bulletPoints: ['100% cotton', 'Slim fit', 'Full sleeves', 'Spread collar', 'Machine washable'], images: [{ imageUrl: IMG(669) }], seller: { businessName: 'FashionHub Store' }, variants: [] },
  { id: 9, title: 'Fossil Gen 6 Smartwatch (42mm, Black Silicone)', brand: 'Fossil', categoryId: 2, price: 17995, mrp: 24995, discountPercent: 28, avgRating: 4.1, totalRatings: 4560, primaryImage: IMG(755), stockQuantity: 60, inStock: true, isFeatured: false, isDealOfDay: false, description: 'Stay connected with Wear OS by Google, powered by Snapdragon.', bulletPoints: ['Wear OS by Google', 'Heart rate & SpO2 tracking', 'Built-in GPS', 'Google Assistant', 'Swim-proof design'], images: [{ imageUrl: IMG(755) }], seller: { businessName: 'FashionHub Store' }, variants: [] },

  // Home & Kitchen
  { id: 10, title: 'Prestige IRIS 750W Mixer Grinder (3 Jars)', brand: 'Prestige', categoryId: 3, price: 2999, mrp: 5495, discountPercent: 45, avgRating: 4.3, totalRatings: 34500, primaryImage: IMG(225), stockQuantity: 400, inStock: true, isFeatured: true, isDealOfDay: true, description: 'Powerful 750W motor with 3 stainless steel jars.', bulletPoints: ['750W powerful motor', '3 stainless steel jars', 'Super sharp blades', '2-year warranty', 'Anti-skid feet'], images: [{ imageUrl: IMG(225) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 11, title: 'Wakefit Orthopedic Memory Foam Mattress (King, 6 inch)', brand: 'Wakefit', categoryId: 3, price: 11999, mrp: 21999, discountPercent: 45, avgRating: 4.4, totalRatings: 56700, primaryImage: IMG(164), stockQuantity: 80, inStock: true, isFeatured: true, isDealOfDay: false, description: '6-inch orthopedic memory foam mattress for ultimate comfort.', bulletPoints: ['6-inch height', 'High-density foam', 'CertiPUR-US certified', '10-year warranty', 'Removable cover'], images: [{ imageUrl: IMG(164) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 12, title: 'Havells Efficiencia Neo 1200mm Ceiling Fan', brand: 'Havells', categoryId: 3, price: 2199, mrp: 3590, discountPercent: 39, avgRating: 4.2, totalRatings: 12300, primaryImage: IMG(535), stockQuantity: 300, inStock: true, isFeatured: false, isDealOfDay: true, description: 'Energy-efficient BLDC motor ceiling fan with remote control.', bulletPoints: ['BLDC motor', '1200mm sweep', 'Remote control', '5-star rated', 'Saves up to 50% electricity'], images: [{ imageUrl: IMG(535) }], seller: { businessName: 'TechVault India' }, variants: [] },

  // Books
  { id: 13, title: 'Atomic Habits by James Clear (Paperback)', brand: 'Penguin', categoryId: 4, price: 345, mrp: 799, discountPercent: 57, avgRating: 4.7, totalRatings: 189000, primaryImage: IMG(24), stockQuantity: 500, inStock: true, isFeatured: true, isDealOfDay: false, description: 'Tiny changes, remarkable results. An easy & proven way to build good habits.', bulletPoints: ['#1 New York Times Bestseller', 'Over 15 million copies sold', 'Practical strategies', 'Science-backed methods'], images: [{ imageUrl: IMG(24) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 14, title: 'The Psychology of Money by Morgan Housel', brand: 'Jaico', categoryId: 4, price: 250, mrp: 399, discountPercent: 37, avgRating: 4.6, totalRatings: 145000, primaryImage: IMG(46), stockQuantity: 600, inStock: true, isFeatured: true, isDealOfDay: true, description: 'Timeless lessons on wealth, greed, and happiness.', bulletPoints: ['19 short stories', 'Financial wisdom', 'New York Times Bestseller', 'Easy to understand'], images: [{ imageUrl: IMG(46) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 15, title: 'Rich Dad Poor Dad by Robert T. Kiyosaki', brand: 'Plata', categoryId: 4, price: 279, mrp: 499, discountPercent: 44, avgRating: 4.5, totalRatings: 234000, primaryImage: IMG(308), stockQuantity: 800, inStock: true, isFeatured: false, isDealOfDay: false, description: 'What the rich teach their kids about money that the poor and middle class do not!', bulletPoints: ['#1 Personal Finance Book', 'Over 40 million copies sold', 'Financial literacy', '25th Anniversary Edition'], images: [{ imageUrl: IMG(308) }], seller: { businessName: 'TechVault India' }, variants: [] },

  // Beauty & Health
  { id: 16, title: 'Maybelline New York Fit Me Foundation (120 Classic Ivory)', brand: 'Maybelline', categoryId: 5, price: 399, mrp: 575, discountPercent: 31, avgRating: 4.2, totalRatings: 45600, primaryImage: IMG(550), stockQuantity: 350, inStock: true, isFeatured: true, isDealOfDay: true, description: 'Lightweight foundation with natural matte finish.', bulletPoints: ['Lightweight formula', 'Matte finish', 'SPF 22', 'Oil-free', 'Micro-powders'], images: [{ imageUrl: IMG(550) }], seller: { businessName: 'FashionHub Store' }, variants: [] },
  { id: 17, title: 'Cetaphil Gentle Skin Cleanser (500ml)', brand: 'Cetaphil', categoryId: 5, price: 699, mrp: 999, discountPercent: 30, avgRating: 4.5, totalRatings: 67800, primaryImage: IMG(550, 400, 400), stockQuantity: 250, inStock: true, isFeatured: false, isDealOfDay: false, description: 'Gentle, non-irritating cleanser for all skin types.', bulletPoints: ['For all skin types', 'Soap-free', 'Dermatologist recommended', 'pH balanced', 'Non-comedogenic'], images: [{ imageUrl: IMG(550, 400, 400) }], seller: { businessName: 'FashionHub Store' }, variants: [] },

  // Sports & Outdoors
  { id: 18, title: 'Boldfit Resistance Bands Set (5 Bands with Handles)', brand: 'Boldfit', categoryId: 6, price: 599, mrp: 1499, discountPercent: 60, avgRating: 4.3, totalRatings: 28900, primaryImage: IMG(1058), stockQuantity: 500, inStock: true, isFeatured: true, isDealOfDay: true, description: 'Complete resistance band set for full body workout.', bulletPoints: ['5 resistance levels', 'Door anchor included', 'Ankle straps', 'Carry bag', 'Premium natural latex'], images: [{ imageUrl: IMG(1058) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 19, title: 'Decathlon Quechua 2-Person Camping Tent', brand: 'Decathlon', categoryId: 6, price: 3999, mrp: 5999, discountPercent: 33, avgRating: 4.4, totalRatings: 8900, primaryImage: IMG(1038), stockQuantity: 45, inStock: true, isFeatured: false, isDealOfDay: false, description: '2-person waterproof camping tent with easy setup.', bulletPoints: ['2-person capacity', 'Waterproof rating 2000mm', 'Easy setup (2 mins)', 'UPF 30+', 'Carry bag included'], images: [{ imageUrl: IMG(1038) }], seller: { businessName: 'TechVault India' }, variants: [] },

  // Toys & Games
  { id: 20, title: 'LEGO Creator 3-in-1 Pirate Ship (31109)', brand: 'LEGO', categoryId: 7, price: 5999, mrp: 8999, discountPercent: 33, avgRating: 4.8, totalRatings: 12300, primaryImage: IMG(1040), stockQuantity: 60, inStock: true, isFeatured: true, isDealOfDay: false, description: 'Build a pirate ship, pirate inn, or skull island.', bulletPoints: ['1260 pieces', '3-in-1 building set', 'Includes 3 minifigures', 'Ages 9+', 'Compatible with all LEGO sets'], images: [{ imageUrl: IMG(1040) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 21, title: 'Funskool Monopoly Classic Board Game', brand: 'Funskool', categoryId: 7, price: 849, mrp: 1499, discountPercent: 43, avgRating: 4.3, totalRatings: 34500, primaryImage: IMG(1040, 400, 400), stockQuantity: 200, inStock: true, isFeatured: false, isDealOfDay: true, description: 'Classic property trading board game for family fun.', bulletPoints: ['2-6 players', 'Ages 8+', 'Classic gameplay', 'Includes dice, tokens, property cards', 'Family game night favorite'], images: [{ imageUrl: IMG(1040, 400, 400) }], seller: { businessName: 'TechVault India' }, variants: [] },

  // Grocery
  { id: 22, title: 'Tata Sampann Unpolished Toor Dal (1kg)', brand: 'Tata', categoryId: 8, price: 169, mrp: 215, discountPercent: 21, avgRating: 4.4, totalRatings: 78900, primaryImage: IMG(292), stockQuantity: 1000, inStock: true, isFeatured: false, isDealOfDay: false, description: 'Unpolished, sourced from best farms.', bulletPoints: ['100% unpolished', 'Rich in protein', 'No added color', 'Sourced from best farms'], images: [{ imageUrl: IMG(292) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 23, title: 'Cadbury Dairy Milk Silk Oreo Chocolate Bar (130g, Pack of 3)', brand: 'Cadbury', categoryId: 8, price: 420, mrp: 540, discountPercent: 22, avgRating: 4.6, totalRatings: 56700, primaryImage: IMG(312), stockQuantity: 500, inStock: true, isFeatured: true, isDealOfDay: true, description: 'Smooth Dairy Milk Silk with crunchy Oreo cookie pieces.', bulletPoints: ['Pack of 3 bars', '130g each', 'Smooth silk chocolate', 'Crunchy Oreo pieces', 'Perfect gift'], images: [{ imageUrl: IMG(312) }], seller: { businessName: 'TechVault India' }, variants: [] },

  // More Electronics for variety
  { id: 24, title: 'OnePlus 12 5G (Flowy Emerald, 256GB, 12GB RAM)', brand: 'OnePlus', categoryId: 1, price: 64999, mrp: 69999, discountPercent: 7, avgRating: 4.4, totalRatings: 8900, primaryImage: IMG(180), stockQuantity: 75, inStock: true, isFeatured: false, isDealOfDay: false, description: 'Flagship killer with Hasselblad camera.', bulletPoints: ['Snapdragon 8 Gen 3', '6.82" 2K ProXDR display', '50MP Hasselblad camera', '100W SUPERVOOC charging', '5400mAh battery'], images: [{ imageUrl: IMG(180) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 25, title: 'boAt Rockerz 550 Over-Ear Wireless Headphones', brand: 'boAt', categoryId: 1, price: 1799, mrp: 4990, discountPercent: 64, avgRating: 4.1, totalRatings: 156000, primaryImage: IMG(367, 400, 400), stockQuantity: 500, inStock: true, isFeatured: false, isDealOfDay: true, description: 'Premium over-ear wireless headphones with 20H playback.', bulletPoints: ['50mm dynamic drivers', '20 hours playback', 'Physical noise isolation', 'Padded ear cushions', 'Dual connectivity'], images: [{ imageUrl: IMG(367, 400, 400) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 26, title: 'Mi 43" 4K Ultra HD Smart Google TV', brand: 'Xiaomi', categoryId: 1, price: 24999, mrp: 34999, discountPercent: 29, avgRating: 4.2, totalRatings: 23400, primaryImage: IMG(365), stockQuantity: 30, inStock: true, isFeatured: true, isDealOfDay: false, description: '43-inch 4K display with built-in Google TV.', bulletPoints: ['4K Ultra HD resolution', 'Google TV built-in', 'Dolby Vision & Atmos', '30W speakers', 'Metal bezel-less design'], images: [{ imageUrl: IMG(365) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 27, title: 'Canon EOS R50 Mirrorless Camera (Body Only)', brand: 'Canon', categoryId: 1, price: 62990, mrp: 74995, discountPercent: 16, avgRating: 4.6, totalRatings: 3400, primaryImage: IMG(250), stockQuantity: 15, inStock: true, isFeatured: false, isDealOfDay: false, description: 'Compact mirrorless camera for content creators.', bulletPoints: ['24.2MP APS-C sensor', '4K 30p video', 'Eye Detection AF', 'Built-in Wi-Fi & Bluetooth', 'Vari-angle touchscreen'], images: [{ imageUrl: IMG(250) }], seller: { businessName: 'TechVault India' }, variants: [] },

  // More Fashion
  { id: 28, title: 'Allen Solly Men\'s Polo T-Shirt (Navy, Cotton)', brand: 'Allen Solly', categoryId: 2, price: 699, mrp: 1499, discountPercent: 53, avgRating: 4.1, totalRatings: 34500, primaryImage: IMG(669, 400, 400), stockQuantity: 400, inStock: true, isFeatured: false, isDealOfDay: true, description: 'Classic polo t-shirt with a regular fit.', bulletPoints: ['100% cotton', 'Regular fit', 'Short sleeves', 'Ribbed collar', 'Machine washable'], images: [{ imageUrl: IMG(669, 400, 400) }], seller: { businessName: 'FashionHub Store' }, variants: [] },
  { id: 29, title: 'Wildcraft 45L Rucksack Backpack (Black)', brand: 'Wildcraft', categoryId: 6, price: 2999, mrp: 5499, discountPercent: 45, avgRating: 4.3, totalRatings: 12300, primaryImage: IMG(1050), stockQuantity: 120, inStock: true, isFeatured: false, isDealOfDay: false, description: '45L rucksack perfect for trekking and hiking.', bulletPoints: ['45L capacity', 'Rain cover included', 'Padded shoulder straps', 'Multiple compartments', 'Durable polyester'], images: [{ imageUrl: IMG(1050) }], seller: { businessName: 'TechVault India' }, variants: [] },
  { id: 30, title: 'Milton Thermosteel Flip Lid Flask (1000ml)', brand: 'Milton', categoryId: 3, price: 699, mrp: 1199, discountPercent: 42, avgRating: 4.3, totalRatings: 89000, primaryImage: IMG(225, 400, 400), stockQuantity: 600, inStock: true, isFeatured: false, isDealOfDay: true, description: 'Double-walled vacuum insulated steel flask.', bulletPoints: ['1000ml capacity', 'Keeps hot 24 hours', 'Keeps cold 24 hours', 'Flip lid design', 'BPA-free'], images: [{ imageUrl: IMG(225, 400, 400) }], seller: { businessName: 'TechVault India' }, variants: [] },
];

// ── Reviews ──
export const reviews = [
  { id: 1, productId: 1, userName: 'Rahul K.', rating: 5, reviewTitle: 'Best phone I\'ve ever used!', reviewBody: 'The camera is absolutely incredible. S Pen is super useful for note-taking. Battery lasts a full day easily.', verifiedPurchase: true, createdAt: '2024-12-15T10:30:00Z' },
  { id: 2, productId: 1, userName: 'Priya M.', rating: 4, reviewTitle: 'Great but expensive', reviewBody: 'Amazing device with top-notch performance. Only downside is the hefty price tag. The titanium frame feels very premium.', verifiedPurchase: true, createdAt: '2024-11-28T15:20:00Z' },
  { id: 3, productId: 1, userName: 'Amit S.', rating: 5, reviewTitle: 'Worth every rupee', reviewBody: 'Switched from iPhone. No regrets at all! The display is stunning and the zoom camera is mind-blowing.', verifiedPurchase: true, createdAt: '2024-12-02T08:45:00Z' },
  { id: 4, productId: 2, userName: 'Sneha R.', rating: 5, reviewTitle: 'Perfect laptop', reviewBody: 'Fast, silent, incredible battery life. The M3 chip handles everything I throw at it without breaking a sweat.', verifiedPurchase: true, createdAt: '2024-12-10T12:00:00Z' },
  { id: 5, productId: 3, userName: 'Vikram P.', rating: 4, reviewTitle: 'Excellent ANC', reviewBody: 'The noise cancellation is truly next level. Very comfortable for long listening sessions. Sound quality is warm and detailed.', verifiedPurchase: true, createdAt: '2024-11-20T09:15:00Z' },
  { id: 6, productId: 6, userName: 'Deepak J.', rating: 5, reviewTitle: 'Perfect fit!', reviewBody: 'These jeans fit like a glove. The stretch denim is very comfortable. Color doesn\'t fade even after multiple washes.', verifiedPurchase: true, createdAt: '2024-12-05T14:30:00Z' },
  { id: 7, productId: 13, userName: 'Anjali T.', rating: 5, reviewTitle: 'Life-changing book', reviewBody: 'This book completely changed how I think about habits. The 1% improvement concept is powerful and practical.', verifiedPurchase: true, createdAt: '2024-12-01T16:00:00Z' },
];

// ── Mock User ──
export const mockUser = {
  id: 2, name: 'Sagar Pattasani', email: 'sagarpattasani185@gmail.com', phone: '+919888888888',
  role: 'ADMIN', profilePic: null, isVerified: true, isActive: true,
};

// ── Mock Addresses ──
export const mockAddresses = [
  { id: 1, userId: 2, fullName: 'Sagar Pattasani', phone: '+919888888888', addressLine1: '123 MG Road', addressLine2: 'Near City Mall', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', country: 'India', isDefault: true, addressType: 'HOME' },
  { id: 2, userId: 2, fullName: 'Sagar Pattasani', phone: '+919888888888', addressLine1: '456 Business Park', addressLine2: 'Sector 5', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', country: 'India', isDefault: false, addressType: 'WORK' },
];

// ── Mock Cart ──
export const mockCart = {
  id: 1,
  items: [
    { id: 1, productId: 1, productTitle: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)', productImage: IMG('Galaxy+S24', 400, 400, '1a1a2e', 'e0e0e0'), brand: 'Samsung', price: 129999, mrp: 149999, quantity: 1, inStock: true },
    { id: 2, productId: 13, productTitle: 'Atomic Habits by James Clear (Paperback)', productImage: IMG('Atomic+Habits', 400, 400, 'f5c518', '1a1a1a'), brand: 'Penguin', price: 345, mrp: 799, quantity: 2, inStock: true },
  ],
  savedForLater: [],
  subtotal: 130689,
  totalItems: 3,
};

// ── Mock Orders ──
export const mockOrders = [
  {
    id: 1, orderNumber: 'AMZ-2024-0001', status: 'DELIVERED', paymentMethod: 'COD', paymentStatus: 'PAID',
    subtotalAmount: 129999, shippingAmount: 0, taxAmount: 23400, discountAmount: 0, totalAmount: 153399,
    firstItemTitle: 'Samsung Galaxy S24 Ultra 5G', firstItemImage: IMG('Galaxy+S24', 400, 400, '1a1a2e', 'e0e0e0'), itemCount: 1,
    createdAt: '2024-12-01T10:30:00Z', expectedDeliveryDate: '2024-12-06',
    items: [{ id: 1, productId: 1, productTitle: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)', productImage: IMG('Galaxy+S24', 400, 400, '1a1a2e', 'e0e0e0'), quantity: 1, unitPrice: 129999, totalPrice: 129999, sellerName: 'TechVault India' }],
    shippingAddress: { fullName: 'Sagar Pattasani', addressLine1: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  },
  {
    id: 2, orderNumber: 'AMZ-2024-0002', status: 'SHIPPED', paymentMethod: 'RAZORPAY', paymentStatus: 'PAID',
    subtotalAmount: 2499, shippingAmount: 0, taxAmount: 450, discountAmount: 0, totalAmount: 2949,
    firstItemTitle: 'Levi\'s Men\'s 511 Slim Fit Jeans', firstItemImage: IMG('Levis+511', 400, 400, '1a2744', 'cc9966'), itemCount: 1,
    createdAt: '2024-12-10T14:00:00Z', expectedDeliveryDate: '2024-12-15',
    items: [{ id: 2, productId: 6, productTitle: 'Levi\'s Men\'s 511 Slim Fit Jeans (Dark Indigo Wash)', productImage: IMG('Levis+511', 400, 400, '1a2744', 'cc9966'), quantity: 1, unitPrice: 2499, totalPrice: 2499, sellerName: 'FashionHub Store' }],
    shippingAddress: { fullName: 'Sagar Pattasani', addressLine1: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  },
];

// ── Mock Notifications ──
export const mockNotifications = [
  { id: 1, type: 'ORDER', title: 'Order Delivered', message: 'Your order AMZ-2024-0001 has been delivered successfully!', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, type: 'ORDER', title: 'Order Shipped', message: 'Your order AMZ-2024-0002 has been shipped and is on its way.', isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, type: 'PAYMENT', title: 'Payment Successful', message: 'Payment of ₹2,949 for order AMZ-2024-0002 was successful.', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

// ── Admin Dashboard Stats ──
export const adminDashboard = {
  totalUsers: 1247, totalOrders: 3856, totalProducts: products.length,
  totalRevenue: 4567890, todayRevenue: 125600, pendingOrders: 23,
  recentOrders: [
    { orderNumber: 'AMZ-2024-0045', userName: 'Rahul Kumar', total: 129999, status: 'PENDING', date: '2024-12-15T10:30:00Z' },
    { orderNumber: 'AMZ-2024-0044', userName: 'Priya Sharma', total: 2499, status: 'SHIPPED', date: '2024-12-14T08:20:00Z' },
    { orderNumber: 'AMZ-2024-0043', userName: 'Amit Patel', total: 26990, status: 'DELIVERED', date: '2024-12-13T16:45:00Z' },
    { orderNumber: 'AMZ-2024-0042', userName: 'Sneha Reddy', total: 5999, status: 'PROCESSING', date: '2024-12-12T11:00:00Z' },
    { orderNumber: 'AMZ-2024-0041', userName: 'Vikram Singh', total: 69900, status: 'CONFIRMED', date: '2024-12-11T09:15:00Z' },
  ],
};

// ── Seller Dashboard Stats ──
export const sellerDashboard = {
  totalProducts: 15, totalOrders: 234, totalEarnings: 1234567, rating: 4.5,
  recentOrders: [
    { orderNumber: 'AMZ-2024-0045', productTitle: 'Samsung Galaxy S24 Ultra', quantity: 1, total: 129999, status: 'PENDING' },
    { orderNumber: 'AMZ-2024-0043', productTitle: 'Sony WH-1000XM5', quantity: 2, total: 53980, status: 'DELIVERED' },
    { orderNumber: 'AMZ-2024-0040', productTitle: 'JBL Charge 5', quantity: 1, total: 13999, status: 'SHIPPED' },
  ],
};

// ── Search Suggestions ──
export const getSearchSuggestions = (query) => {
  const q = query.toLowerCase();
  const matchedProducts = products.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, 6);
  const matchedBrands = [...new Set(products.filter(p => p.brand.toLowerCase().includes(q)).map(p => p.brand))].slice(0, 3);
  return { products: matchedProducts.map(p => ({ id: p.id, title: p.title, brand: p.brand })), brands: matchedBrands };
};

// ── Product Filtering & Sorting ──
export const filterProducts = (params = {}) => {
  let result = [...products];

  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
  }
  if (params.category) result = result.filter(p => p.categoryId === parseInt(params.category));
  if (params.brand) result = result.filter(p => p.brand === params.brand);
  if (params.minPrice) result = result.filter(p => p.price >= parseInt(params.minPrice));
  if (params.maxPrice) result = result.filter(p => p.price <= parseInt(params.maxPrice));

  switch (params.sort) {
    case 'price_asc': result.sort((a, b) => a.price - b.price); break;
    case 'price_desc': result.sort((a, b) => b.price - a.price); break;
    case 'rating': result.sort((a, b) => b.avgRating - a.avgRating); break;
    case 'popularity': result.sort((a, b) => b.totalRatings - a.totalRatings); break;
    case 'discount': result.sort((a, b) => b.discountPercent - a.discountPercent); break;
    default: result.sort((a, b) => b.id - a.id); // newest
  }

  const page = parseInt(params.page || '0');
  const size = parseInt(params.size || '20');
  const totalElements = result.length;
  const totalPages = Math.ceil(totalElements / size);
  const content = result.slice(page * size, (page + 1) * size);

  return { content, totalElements, totalPages, number: page, size };
};

export const getBrands = (categoryId) => {
  let filtered = products;
  if (categoryId) filtered = products.filter(p => p.categoryId === parseInt(categoryId));
  return [...new Set(filtered.map(p => p.brand))];
};

// ── Coupons ──
export const coupons = [
  { code: 'SAVE10', type: 'PERCENT', value: 10, minOrder: 500, maxDiscount: 200, description: '10% off on orders above ₹500 (max ₹200)', active: true },
  { code: 'FLAT500', type: 'FLAT', value: 500, minOrder: 3000, maxDiscount: 500, description: '₹500 off on orders above ₹3000', active: true },
  { code: 'NEWUSER', type: 'PERCENT', value: 15, minOrder: 0, maxDiscount: 300, description: '15% off for new users (max ₹300)', active: true },
  { code: 'FREEDOM25', type: 'PERCENT', value: 25, minOrder: 2000, maxDiscount: 1000, description: '25% off on orders above ₹2000 (max ₹1000)', active: true },
  { code: 'FLAT100', type: 'FLAT', value: 100, minOrder: 499, maxDiscount: 100, description: '₹100 off on orders above ₹499', active: true },
  { code: 'EXPIRED20', type: 'PERCENT', value: 20, minOrder: 0, maxDiscount: 500, description: 'Expired coupon', active: false },
];
