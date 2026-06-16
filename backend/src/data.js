const artisans = [
  {
    id: 1,
    name: "Ramesh Kumar",
    category: "Wood Carving",
    image: "https://images.unsplash.com/photo-1542330952650-efce130ebc18?w=400",
    rating: 4.9,
    tagline: "Mastering the grain for 25 years",
    bio: "Hailing from Saharanpur, I carry forward a 300-year-old family legacy of fine woodcraft, carving intricate traditional and modern designs from sustainable local timber.",
    location: "Saharanpur",
    experience: "25 years",
    videos: []
  },
  {
    id: 2,
    name: "Lakshmi Devi",
    category: "Madhubani Painting",
    image: "https://images.unsplash.com/photo-1595085610896-bc316fb01b8e?w=400",
    rating: 5.0,
    tagline: "Colors of Mithila brought to life",
    bio: "I paint ancient mythologies using natural pigments sourced from soot, turmeric, and indigo. Every brushstroke preserves the rich cultural heritage of Bihar.",
    location: "Madhubani",
    experience: "18 years",
    videos: []
  },
  {
    id: 3,
    name: "Anjali Verma",
    category: "Hand Embroidery",
    image: "https://images.unsplash.com/photo-1591851221711-50e4179d6756?w=400",
    rating: 4.8,
    tagline: "Intricate threads, timeless elegance",
    bio: "Specializing in Chikankari and Phulkari, my craft involves delicate hand-embroidery that breathes life into fabric, a skill passed down from my grandmother.",
    location: "Lucknow",
    experience: "12 years",
    videos: []
  },
  {
    id: 4,
    name: "Shankar Rao",
    category: "Terracotta Art",
    image: "https://images.unsplash.com/photo-1555529902-5261145633bf?w=400",
    rating: 4.7,
    tagline: "Molding the earth into art",
    bio: "Using pure riverbank clay, I hand-shape and kiln-fire traditional terracotta planters, sculptures, and diyas that connect homes back to nature.",
    location: "Karnataka",
    experience: "30 years",
    videos: []
  },
  {
    id: 5,
    name: "Meera Patel",
    category: "Handloom Textiles",
    image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400",
    rating: 4.9,
    tagline: "Weaving stories on the loom",
    bio: "I craft vibrant, authentic handloom textiles. My work involves traditional pit-loom weaving to create ethical and sustainable Indian fashion.",
    location: "Gujarat",
    experience: "20 years",
    videos: []
  },
  {
    id: 6,
    name: "Ravi Choudhary",
    category: "Blue Pottery",
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400",
    rating: 4.9,
    tagline: "The royal blue hues of Jaipur",
    bio: "Unlike standard ceramics, my pottery uses quartz stone powder instead of clay. It's a challenging, painstaking process that yields brilliant, unfading blue art.",
    location: "Jaipur",
    experience: "15 years",
    videos: []
  },
  {
    id: 7,
    name: "Kavitha Nair",
    category: "Bamboo Crafts",
    image: "https://images.unsplash.com/photo-1506869640319-fea1a2ab8e9c?w=400",
    rating: 4.8,
    tagline: "Weaving nature into utility",
    bio: "I transform locally sourced bamboo into elegant, sustainable furniture, lampshades, and baskets. My craft reflects the harmony of nature and utility.",
    location: "Assam",
    experience: "14 years",
    videos: []
  },
  {
    id: 8,
    name: "Harish Joshi",
    category: "Metalwork",
    image: "https://images.unsplash.com/photo-1546961342-9957252cb7ec?w=400",
    rating: 4.8,
    tagline: "Casting light and legacy",
    bio: "From traditional oil lamps to ornate idols, I practice sand casting and hand-engraving brass and bell metal, techniques native to the 'Brass City' of India.",
    location: "Moradabad",
    experience: "22 years",
    videos: []
  },
  {
    id: 9,
    name: "Sunita Kumari",
    category: "Jute Craft",
    image: "https://images.unsplash.com/photo-1571210986790-2c7cc1e9dbdc?w=400",
    rating: 4.7,
    tagline: "The golden fiber of Bengal",
    bio: "I weave natural fibers into durable, beautiful baskets, mats, and bags. My craft supports local women's cooperatives in rural Bengal.",
    location: "West Bengal",
    experience: "10 years",
    videos: []
  },
  {
    id: 10,
    name: "Abdul Rahman",
    category: "Leather Craft",
    image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=400",
    rating: 4.9,
    tagline: "Stitching durability and heritage",
    bio: "I use cruelty-free, vegetable-tanned leather to hand-stitch journals, bags, and accessories, preserving the iconic Rajasthani leatherworking tradition.",
    location: "Rajasthan",
    experience: "18 years",
    videos: []
  }
];

const products = [
  { id: 1, name: "Wooden Temple Decor", price: 3500, image: "https://images.unsplash.com/photo-1605814597473-b3c9735d4ba2?w=500", artisanId: 1, artisanName: "Ramesh Kumar", artisanImage: "https://images.unsplash.com/photo-1542330952650-efce130ebc18?w=400", category: "Wood Carving", artisanLocation: "Saharanpur" },
  { id: 2, name: "Madhubani Wall Painting", price: 2100, image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=500", artisanId: 2, artisanName: "Lakshmi Devi", artisanImage: "https://images.unsplash.com/photo-1595085610896-bc316fb01b8e?w=400", category: "Madhubani Painting", artisanLocation: "Madhubani" },
  { id: 3, name: "Handwoven Cotton Saree", price: 4200, image: "https://images.unsplash.com/photo-1620733723572-11c53f73a2ad?w=500", artisanId: 5, artisanName: "Meera Patel", artisanImage: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400", category: "Handloom Textiles", artisanLocation: "Gujarat" },
  { id: 4, name: "Blue Pottery Vase", price: 1450, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500", artisanId: 6, artisanName: "Ravi Choudhary", artisanImage: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400", category: "Blue Pottery", artisanLocation: "Jaipur" },
  { id: 5, name: "Brass Oil Lamp", price: 2800, image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=500", artisanId: 8, artisanName: "Harish Joshi", artisanImage: "https://images.unsplash.com/photo-1546961342-9957252cb7ec?w=400", category: "Metalwork", artisanLocation: "Moradabad" },
  { id: 6, name: "Terracotta Planter", price: 650, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500", artisanId: 4, artisanName: "Shankar Rao", artisanImage: "https://images.unsplash.com/photo-1555529902-5261145633bf?w=400", category: "Terracotta Art", artisanLocation: "Karnataka" },
  { id: 7, name: "Handcrafted Jute Basket", price: 850, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500", artisanId: 9, artisanName: "Sunita Kumari", artisanImage: "https://images.unsplash.com/photo-1571210986790-2c7cc1e9dbdc?w=400", category: "Jute Craft", artisanLocation: "West Bengal" },
  { id: 8, name: "Chikankari Cushion Cover", price: 450, image: "https://images.unsplash.com/photo-1584285423851-40e118c7a6e1?w=500", artisanId: 3, artisanName: "Anjali Verma", artisanImage: "https://images.unsplash.com/photo-1591851221711-50e4179d6756?w=400", category: "Hand Embroidery", artisanLocation: "Lucknow" },
  { id: 9, name: "Intricate Wooden Box", price: 1200, image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500", artisanId: 1, artisanName: "Ramesh Kumar", artisanImage: "https://images.unsplash.com/photo-1542330952650-efce130ebc18?w=400", category: "Wood Carving", artisanLocation: "Saharanpur" },
  { id: 10, name: "Handmade Leather Journal", price: 950, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500", artisanId: 10, artisanName: "Abdul Rahman", artisanImage: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=400", category: "Leather Craft", artisanLocation: "Rajasthan" },
  { id: 11, name: "Woven Bamboo Lampshade", price: 1850, image: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=500", artisanId: 7, artisanName: "Kavitha Nair", artisanImage: "https://images.unsplash.com/photo-1506869640319-fea1a2ab8e9c?w=400", category: "Bamboo Crafts", artisanLocation: "Assam" },
  { id: 12, name: "Bamboo Storage Basket", price: 750, image: "https://images.unsplash.com/photo-1559981403-1a0e0f805219?w=500", artisanId: 7, artisanName: "Kavitha Nair", artisanImage: "https://images.unsplash.com/photo-1506869640319-fea1a2ab8e9c?w=400", category: "Bamboo Crafts", artisanLocation: "Assam" },
  { id: 13, name: "Handwoven Table Runner", price: 850, image: "https://images.unsplash.com/photo-1601000844782-b364de064438?w=500", artisanId: 5, artisanName: "Meera Patel", artisanImage: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400", category: "Handloom Textiles", artisanLocation: "Gujarat" },
  { id: 14, name: "Traditional Diyas", price: 250, image: "https://images.unsplash.com/photo-1510007886266-9121650b4d45?w=500", artisanId: 4, artisanName: "Shankar Rao", artisanImage: "https://images.unsplash.com/photo-1555529902-5261145633bf?w=400", category: "Terracotta Art", artisanLocation: "Karnataka" },
  { id: 15, name: "Handmade Ceramic Mug", price: 550, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500", artisanId: 6, artisanName: "Ravi Choudhary", artisanImage: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400", category: "Blue Pottery", artisanLocation: "Jaipur" }
];

const stories = [
  { id: 1, artisanId: 1, title: "Carving History", content: "..." },
  { id: 2, artisanId: 2, title: "Colors of Mithila", content: "..." },
  { id: 3, artisanId: 5, title: "Threads of Gujarat", content: "..." },
  { id: 4, artisanId: 6, title: "The Blue Quartz", content: "..." },
  { id: 5, artisanId: 8, title: "Casting Moradabad Metal", content: "..." },
  { id: 6, artisanId: 7, title: "Weaving Bamboo", content: "..." }
];

module.exports = { artisans, products, stories };