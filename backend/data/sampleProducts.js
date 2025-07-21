const sampleProducts = [
  {
    name: "Diamond Solitaire Ring",
    description: "A timeless 14k white gold ring featuring a brilliant-cut diamond in a classic solitaire setting. Perfect for engagements and special occasions.",
    category: "rings",
    productCollection: "engagement",
    metalType: "White Gold",
    price: 1899,
    originalPrice: 2200,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=top"
    ],
    specifications: {
      weight: "3.2g",
      dimensions: "Size 6-8",
      stoneType: "Diamond",
      stoneWeight: "0.5 carat",
      setting: "Prong"
    },
    variants: [
      { size: "6", metalType: "White Gold", price: 1899, stock: 5 },
      { size: "7", metalType: "White Gold", price: 1899, stock: 8 },
      { size: "8", metalType: "White Gold", price: 1899, stock: 3 }
    ],
    stock: 16,
    rating: 4.8,
    reviewCount: 127,
    featured: true,
    tags: ["engagement", "diamond", "classic", "luxury"],
    sku: "DSR-001"
  },
  {
    name: "Rose Gold Tennis Bracelet",
    description: "Elegant rose gold bracelet with alternating diamonds and sapphires. Perfect for adding sophistication to any outfit.",
    category: "bracelets",
    productCollection: "everyday",
    metalType: "Rose Gold",
    price: 899,
    originalPrice: 1100,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&crop=bottom"
    ],
    specifications: {
      weight: "8.5g",
      dimensions: "7.5 inches",
      stoneType: "Diamond & Sapphire",
      stoneWeight: "2.1 carats total",
      setting: "Channel"
    },
    variants: [
      { size: "7", metalType: "Rose Gold", price: 899, stock: 4 },
      { size: "7.5", metalType: "Rose Gold", price: 899, stock: 6 }
    ],
    stock: 10,
    rating: 4.6,
    reviewCount: 89,
    featured: true,
    tags: ["tennis", "rose gold", "diamond", "sapphire"],
    sku: "RGB-002"
  },
  {
    name: "Pearl Drop Earrings",
    description: "Sophisticated sterling silver earrings featuring freshwater pearls. Perfect for both casual and formal occasions.",
    category: "earrings",
    productCollection: "everyday",
    metalType: "Sterling Silver",
    price: 149,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&crop=top"
    ],
    specifications: {
      weight: "4.2g",
      dimensions: "1.5 inches",
      stoneType: "Freshwater Pearl",
      stoneWeight: "8mm",
      setting: "Post"
    },
    variants: [
      { size: "Standard", metalType: "Sterling Silver", price: 149, stock: 25 }
    ],
    stock: 25,
    rating: 4.4,
    reviewCount: 203,
    featured: false,
    tags: ["pearl", "silver", "elegant", "versatile"],
    sku: "PDE-003"
  },
  {
    name: "Emerald Pendant Necklace",
    description: "Stunning 14k gold necklace featuring a natural emerald pendant. A statement piece that adds color and elegance.",
    category: "necklaces",
    productCollection: "birthday",
    metalType: "14k Gold",
    price: 649,
    originalPrice: 799,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&crop=bottom"
    ],
    specifications: {
      weight: "6.8g",
      dimensions: "18 inches",
      stoneType: "Natural Emerald",
      stoneWeight: "0.8 carat",
      setting: "Bezel"
    },
    variants: [
      { size: "18", metalType: "14k Gold", price: 649, stock: 12 }
    ],
    stock: 12,
    rating: 4.7,
    reviewCount: 156,
    featured: true,
    tags: ["emerald", "gold", "pendant", "statement"],
    sku: "EPN-004"
  },
  {
    name: "Platinum Wedding Band",
    description: "Classic platinum wedding band with a subtle brushed finish. Timeless design for the perfect wedding day.",
    category: "rings",
    productCollection: "wedding",
    metalType: "Platinum",
    price: 1299,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=bottom",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=left",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=right"
    ],
    specifications: {
      weight: "4.1g",
      dimensions: "Size 6-10",
      stoneType: "None",
      stoneWeight: "N/A",
      setting: "Plain"
    },
    variants: [
      { size: "6", metalType: "Platinum", price: 1299, stock: 8 },
      { size: "7", metalType: "Platinum", price: 1299, stock: 10 },
      { size: "8", metalType: "Platinum", price: 1299, stock: 6 },
      { size: "9", metalType: "Platinum", price: 1299, stock: 4 },
      { size: "10", metalType: "Platinum", price: 1299, stock: 3 }
    ],
    stock: 31,
    rating: 4.9,
    reviewCount: 89,
    featured: true,
    tags: ["wedding", "platinum", "classic", "timeless"],
    sku: "PWB-005"
  },
  {
    name: "Diamond Stud Earrings",
    description: "Timeless diamond stud earrings in 14k white gold. Perfect for everyday elegance and special occasions.",
    category: "earrings",
    productCollection: "everyday",
    metalType: "White Gold",
    price: 799,
    originalPrice: 950,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&crop=bottom",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&crop=left",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&crop=right"
    ],
    specifications: {
      weight: "2.8g",
      dimensions: "0.25 inches",
      stoneType: "Diamond",
      stoneWeight: "0.3 carats total",
      setting: "Prong"
    },
    variants: [
      { size: "Standard", metalType: "White Gold", price: 799, stock: 20 }
    ],
    stock: 20,
    rating: 4.8,
    reviewCount: 234,
    featured: true,
    tags: ["diamond", "studs", "classic", "versatile"],
    sku: "DSE-006"
  },
  {
    name: "Ruby Anniversary Ring",
    description: "Beautiful ruby ring set in 14k rose gold. Perfect for celebrating special anniversaries and milestones.",
    category: "rings",
    productCollection: "anniversary",
    metalType: "Rose Gold",
    price: 549,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=top&h=600",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=center&h=600",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=bottom&h=600"
    ],
    specifications: {
      weight: "3.5g",
      dimensions: "Size 6-8",
      stoneType: "Ruby",
      stoneWeight: "0.4 carat",
      setting: "Bezel"
    },
    variants: [
      { size: "6", metalType: "Rose Gold", price: 549, stock: 7 },
      { size: "7", metalType: "Rose Gold", price: 549, stock: 9 },
      { size: "8", metalType: "Rose Gold", price: 549, stock: 5 }
    ],
    stock: 21,
    rating: 4.6,
    reviewCount: 78,
    featured: false,
    tags: ["ruby", "anniversary", "rose gold", "romantic"],
    sku: "RAR-007"
  },
  {
    name: "Sterling Silver Chain Necklace",
    description: "Minimalist sterling silver chain necklace. Perfect for layering or wearing alone for a clean, modern look.",
    category: "necklaces",
    productCollection: "everyday",
    metalType: "Sterling Silver",
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&crop=top&h=600",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&crop=center&h=600",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&crop=bottom&h=600"
    ],
    specifications: {
      weight: "3.2g",
      dimensions: "16-18 inches",
      stoneType: "None",
      stoneWeight: "N/A",
      setting: "Chain"
    },
    variants: [
      { size: "16", metalType: "Sterling Silver", price: 89, stock: 15 },
      { size: "18", metalType: "Sterling Silver", price: 89, stock: 18 }
    ],
    stock: 33,
    rating: 4.3,
    reviewCount: 167,
    featured: false,
    tags: ["silver", "chain", "minimalist", "layering"],
    sku: "SCN-008"
  },
  {
    name: "Sapphire Cocktail Ring",
    description: "Stunning sapphire cocktail ring in 14k white gold. A bold statement piece for special occasions.",
    category: "rings",
    productCollection: "birthday",
    metalType: "White Gold",
    price: 1299,
    originalPrice: 1500,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=left&h=600",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=center&h=600",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&fit=crop&crop=right&h=600"
    ],
    specifications: {
      weight: "5.2g",
      dimensions: "Size 6-8",
      stoneType: "Sapphire",
      stoneWeight: "1.2 carats",
      setting: "Halo"
    },
    variants: [
      { size: "6", metalType: "White Gold", price: 1299, stock: 4 },
      { size: "7", metalType: "White Gold", price: 1299, stock: 6 },
      { size: "8", metalType: "White Gold", price: 1299, stock: 3 }
    ],
    stock: 13,
    rating: 4.7,
    reviewCount: 92,
    featured: true,
    tags: ["sapphire", "cocktail", "statement", "luxury"],
    sku: "SCR-009"
  },
  {
    name: "Gold Bangle Bracelet",
    description: "Elegant 14k gold bangle bracelet with a modern twist. Perfect for stacking or wearing alone.",
    category: "bracelets",
    productCollection: "everyday",
    metalType: "14k Gold",
    price: 399,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&crop=top&h=600",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&crop=center&h=600",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&fit=crop&crop=bottom&h=600"
    ],
    specifications: {
      weight: "7.8g",
      dimensions: "2.5 inches diameter",
      stoneType: "None",
      stoneWeight: "N/A",
      setting: "Plain"
    },
    variants: [
      { size: "Standard", metalType: "14k Gold", price: 399, stock: 22 }
    ],
    stock: 22,
    rating: 4.5,
    reviewCount: 134,
    featured: false,
    tags: ["gold", "bangle", "stacking", "modern"],
    sku: "GBB-010"
  },
  {
    name: "Pearl and Diamond Necklace",
    description: "Sophisticated necklace featuring alternating pearls and diamonds. Perfect for weddings and formal events.",
    category: "necklaces",
    productCollection: "wedding",
    metalType: "White Gold",
    price: 899,
    originalPrice: 1100,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&crop=left&h=600",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&crop=center&h=600",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&fit=crop&crop=right&h=600"
    ],
    specifications: {
      weight: "9.2g",
      dimensions: "18 inches",
      stoneType: "Pearl & Diamond",
      stoneWeight: "1.5 carats total",
      setting: "Bead"
    },
    variants: [
      { size: "18", metalType: "White Gold", price: 899, stock: 8 }
    ],
    stock: 8,
    rating: 4.8,
    reviewCount: 67,
    featured: true,
    tags: ["pearl", "diamond", "wedding", "formal"],
    sku: "PDN-011"
  },
  {
    name: "Rose Gold Hoop Earrings",
    description: "Timeless rose gold hoop earrings with a modern design. Perfect for everyday wear and special occasions.",
    category: "earrings",
    productCollection: "everyday",
    metalType: "Rose Gold",
    price: 249,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&crop=top&h=600",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&crop=center&h=600",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&fit=crop&crop=bottom&h=600"
    ],
    specifications: {
      weight: "3.1g",
      dimensions: "1 inch diameter",
      stoneType: "None",
      stoneWeight: "N/A",
      setting: "Hoop"
    },
    variants: [
      { size: "Standard", metalType: "Rose Gold", price: 249, stock: 30 }
    ],
    stock: 30,
    rating: 4.4,
    reviewCount: 189,
    featured: false,
    tags: ["hoops", "rose gold", "timeless", "versatile"],
    sku: "RHE-012"
  }
];

module.exports = sampleProducts; 