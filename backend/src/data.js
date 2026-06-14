const artisans = [
  {
    id: 1,
    name: "Maria Rodriguez",
    category: "Pottery",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 4.8,
    tagline: "Handcrafted ceramics with soul",
    bio: "With over 15 years of experience, I create unique pottery pieces inspired by traditional techniques and modern design.",
    location: "Santa Fe, NM",
    videos: [
      { id: 1, title: "Throwing on the Wheel", thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", duration: "2:34" },
      { id: 2, title: "Glazing Process", thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", duration: "1:45" }
    ]
  },
  {
    id: 2,
    name: "James Chen",
    category: "Woodworking",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    rating: 4.9,
    tagline: "Fine furniture from sustainable woods",
    bio: "I specialize in custom furniture using locally sourced, sustainable hardwoods. Each piece tells a story.",
    location: "Portland, OR",
    videos: [
      { id: 3, title: "Joinery Techniques", thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", duration: "3:12" }
    ]
  },
  {
    id: 3,
    name: "Sarah Johnson",
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    rating: 4.7,
    tagline: "Contemporary silver & gemstone designs",
    bio: "Creating wearable art that combines traditional silversmithing with contemporary aesthetics.",
    location: "Asheville, NC",
    videos: [
      { id: 4, title: "Stone Setting", thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", duration: "2:18" }
    ]
  },
  {
    id: 4,
    name: "Marcus Thompson",
    category: "Leatherwork",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    rating: 4.6,
    tagline: "Handcrafted leather goods",
    bio: "From wallets to belts, I craft durable, beautiful leather items using time-honored techniques.",
    location: "Austin, TX",
    videos: []
  },
  {
    id: 5,
    name: "Elena Petrov",
    category: "Textiles",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    rating: 4.8,
    tagline: "Woven stories in fabric",
    bio: "Weaving traditional patterns with a modern twist, creating unique textile art and home goods.",
    location: "Providence, RI",
    videos: [
      { id: 5, title: "Loom Weaving", thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", duration: "4:02" }
    ]
  },
  {
    id: 6,
    name: "David Kim",
    category: "Glasswork",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 4.9,
    tagline: "Blown glass art & functional pieces",
    bio: "Master glassblower creating both decorative and functional glassware with vibrant colors and unique shapes.",
    location: "Seattle, WA",
    videos: [
      { id: 6, title: "Glass Blowing Demo", thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300", duration: "3:45" }
    ]
  }
];

const products = [
  { id: 1, name: "Ceramic Bowl", price: 85, image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500", artisanId: 1, artisanName: "Maria Rodriguez", artisanImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", category: "Pottery", artisanLocation: "Santa Fe" },
  { id: 2, name: "Clay Vase", price: 120, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500", artisanId: 1, artisanName: "Maria Rodriguez", artisanImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", category: "Pottery", artisanLocation: "Santa Fe" },
  { id: 3, name: "Oak Dining Table", price: 2500, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500", artisanId: 2, artisanName: "James Chen", artisanImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", category: "Woodworking", artisanLocation: "Portland" },
  { id: 4, name: "Walnut Bookshelf", price: 1800, image: "https://images.unsplash.com/photo-1594620859311-370eb333858c?w=500", artisanId: 2, artisanName: "James Chen", artisanImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", category: "Woodworking", artisanLocation: "Portland" },
  { id: 5, name: "Silver Necklace", price: 195, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500", artisanId: 3, artisanName: "Sarah Johnson", artisanImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400", category: "Jewelry", artisanLocation: "Asheville" },
  { id: 6, name: "Turquoise Earrings", price: 145, image: "https://images.unsplash.com/photo-1535633302704-c02fbcac852a?w=500", artisanId: 3, artisanName: "Sarah Johnson", artisanImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400", category: "Jewelry", artisanLocation: "Asheville" },
  { id: 7, name: "Leather Wallet", price: 75, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500", artisanId: 4, artisanName: "Marcus Thompson", artisanImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", category: "Handicrafts", artisanLocation: "Austin" },
  { id: 8, name: "Leather Belt", price: 110, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", artisanId: 4, artisanName: "Marcus Thompson", artisanImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", category: "Handicrafts", artisanLocation: "Austin" },
  { id: 9, name: "Woven Blanket", price: 320, image: "https://images.unsplash.com/photo-1580302200322-224432540afb?w=500", artisanId: 5, artisanName: "Elena Petrov", artisanImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", category: "Paintings", artisanLocation: "Seattle" },
  { id: 10, name: "Table Runner", price: 95, image: "https://images.unsplash.com/photo-1620733723572-11c53f73a2ad?w=500", artisanId: 5, artisanName: "Elena Petrov", artisanImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", category: "Paintings", artisanLocation: "Seattle" },
  { id: 11, name: "Glass Pitcher", price: 165, image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=500", artisanId: 6, artisanName: "David Kim", artisanImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", category: "Paintings", artisanLocation: "Seattle" },
  { id: 12, name: "Decorative Orb", price: 85, image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=500", artisanId: 6, artisanName: "David Kim", artisanImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", category: "Paintings", artisanLocation: "Seattle" },
  { id: 13, name: "Ceramic Mug Set", price: 140, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500", artisanId: 1, artisanName: "Maria Rodriguez", artisanImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", category: "Pottery", artisanLocation: "Santa Fe" },
  { id: 14, name: "Wooden Cutting Board", price: 95, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500", artisanId: 2, artisanName: "James Chen", artisanImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", category: "Woodworking", artisanLocation: "Portland" }
];

const stories = [
  { id: 1, artisanId: 1, title: "A Day in the Studio", content: "..." },
  { id: 2, artisanId: 2, title: "Sourcing Sustainable Wood", content: "..." },
  { id: 3, artisanId: 3, title: "Gemstone Journey", content: "..." },
  { id: 4, artisanId: 4, title: "Leather Tanning Process", content: "..." },
  { id: 5, artisanId: 5, title: "Textile Traditions", content: "..." },
  { id: 6, artisanId: 6, title: "Hot Glass Magic", content: "..." }
];

module.exports = { artisans, products, stories };