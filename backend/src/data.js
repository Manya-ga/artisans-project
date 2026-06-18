const artisans = [
  {
    "id": "51ef27a8-5553-4a8b-b5b6-ebd6e9a9d28c",
    "name": "Khurja Pottery Masters",
    "category": "Pottery",
    "image": "https://images.unsplash.com/photo-1560609189-f1f4a7310ffa?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop",
    "location": "Khurja",
    "rating": 4.8,
    "tagline": "Timeless ceramics from Khurja",
    "bio": "Renowned for our vibrant, hand-painted blue pottery ceramics."
  },
  {
    "id": "a881bced-2a0d-4eb3-9562-6d54683dd075",
    "name": "Jaipur Blue Art",
    "category": "Pottery",
    "image": "https://images.unsplash.com/photo-1531688636-f00e96030c6a?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop",
    "location": "Jaipur",
    "rating": 4.9,
    "tagline": "The royal blue of Jaipur",
    "bio": "Creating traditional Jaipur blue pottery using quartz stone."
  },
  {
    "id": "e891f739-af74-4391-b2f0-ad68c1c8a708",
    "name": "Balaramapuram Weaves",
    "category": "Handloom",
    "image": "https://images.unsplash.com/photo-1605001088481-9b1da79b764f?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&auto=format&fit=crop",
    "location": "Trivandrum",
    "rating": 4.7,
    "tagline": "The elegance of Kasavu",
    "bio": "Authentic Kerala Kasavu handlooms woven with fine cotton and golden zari."
  },
  {
    "id": "b9e43565-1fcb-4c8d-b894-ecaae3b4a162",
    "name": "Bhujodi Heritage Weavers",
    "category": "Handloom",
    "image": "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1612241530263-710c1b0ca131?w=800&auto=format&fit=crop",
    "location": "Bhujodi",
    "rating": 4.9,
    "tagline": "Threads of the desert",
    "bio": "Specializing in traditional extra-weft Bhujodi weaving techniques."
  },
  {
    "id": "3e48676d-7d55-407c-88ed-1968c66ed59a",
    "name": "Channapatna Joy Makers",
    "category": "Wooden Crafts",
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1616429777191-cc11a3c8bb2a?w=800&auto=format&fit=crop",
    "location": "Channapatna",
    "rating": 4.8,
    "tagline": "Play safe, play natural",
    "bio": "Safe, non-toxic wooden toys colored with vegetable dyes."
  },
  {
    "id": "23da8051-e941-42d7-9a26-6a7d56b2677a",
    "name": "Saharanpur Woodworks",
    "category": "Wooden Crafts",
    "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=800&auto=format&fit=crop",
    "location": "Saharanpur",
    "rating": 4.9,
    "tagline": "Masterpieces in wood",
    "bio": "Intricately carved wooden furniture and home decors."
  },
  {
    "id": "36f44527-4fa2-4566-82f9-adc6ae63c500",
    "name": "Sankheda Furniture Crafts",
    "category": "Wooden Crafts",
    "image": "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&auto=format&fit=crop",
    "location": "Sankheda",
    "rating": 4.7,
    "tagline": "Colorful traditions in wood",
    "bio": "Traditional teak wood furniture treated with lacquer colors."
  },
  {
    "id": "d83bfcca-7f91-4152-af94-ccdfbf66a994",
    "name": "Jaipur Silver Crafts",
    "category": "Jewelry",
    "image": "https://images.unsplash.com/photo-1515562141207-8ea4f3c7e7b3?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1535632066939-bb19c1be3db4?w=800&auto=format&fit=crop",
    "location": "Jaipur",
    "rating": 4.9,
    "tagline": "Adorn yourself in silver",
    "bio": "Handcrafted oxidized silver and semi-precious stone jewelry."
  },
  {
    "id": "21c70c12-fa51-4b77-8f71-4c0457b774b3",
    "name": "Dokra Brass Jewelry",
    "category": "Jewelry",
    "image": "https://images.unsplash.com/photo-1611085583163-fdf6fcb5b8ec?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1515562141207-8ea4f3c7e7b3?w=800&auto=format&fit=crop",
    "location": "Bastar",
    "rating": 4.8,
    "tagline": "Rustic metal art",
    "bio": "Ancient lost-wax metal casting jewelry designs."
  },
  {
    "id": "706fcc13-d31d-47be-b3d9-026a8b68369c",
    "name": "Hyderabad Pearl Masters",
    "category": "Jewelry",
    "image": "https://images.unsplash.com/photo-1535632066939-bb19c1be3db4?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1611085583163-fdf6fcb5b8ec?w=800&auto=format&fit=crop",
    "location": "Hyderabad",
    "rating": 4.9,
    "tagline": "The city of pearls",
    "bio": "Authentic fresh water pearls set in gold and silver."
  },
  {
    "id": "c7d9a3af-0b73-4a0e-b2f5-8fe57f2ccfd7",
    "name": "Madhubani Art Collective",
    "category": "Paintings",
    "image": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "location": "Madhubani",
    "rating": 4.9,
    "tagline": "The colors of Mithila",
    "bio": "Intricate folk art paintings depicting nature and mythology."
  },
  {
    "id": "bc34a1c2-3552-44df-a1a5-481682ddb2ed",
    "name": "Pattachitra Canvas",
    "category": "Paintings",
    "image": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "location": "Raghurajpur",
    "rating": 4.8,
    "tagline": "Stories on scroll",
    "bio": "Scroll painting on cloth, an ancient tradition of Odisha."
  },
  {
    "id": "3040605b-e153-4191-a396-f8de2189a56e",
    "name": "Banarasi Silk Weavers",
    "category": "Textiles",
    "image": "https://images.unsplash.com/photo-1611095973763-414019e72400?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&auto=format&fit=crop",
    "location": "Varanasi",
    "rating": 5,
    "tagline": "The timeless drape of Kashi",
    "bio": "Weaving luxurious silk sarees with rich gold and silver brocade."
  },
  {
    "id": "c55bdf7a-e220-4da3-9f7e-d75495256d97",
    "name": "Kalamkari Block Prints",
    "category": "Textiles",
    "image": "https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1605001088481-9b1da79b764f?w=800&auto=format&fit=crop",
    "location": "Machilipatnam",
    "rating": 4.8,
    "tagline": "Art on fabric",
    "bio": "Vegetable-dyed hand block prints with intricate floral patterns."
  },
  {
    "id": "6c022b74-9e45-41c3-9828-73da0a5e22f0",
    "name": "Kanjivaram Silk Looms",
    "category": "Textiles",
    "image": "https://images.unsplash.com/photo-1612241530263-710c1b0ca131?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&auto=format&fit=crop",
    "location": "Kanchipuram",
    "rating": 4.9,
    "tagline": "Woven for generations",
    "bio": "Authentic heavy silk sarees renowned for durability and shine."
  },
  {
    "id": "54590e2a-251b-4d5c-b659-2dc693334bbf",
    "name": "Assam Bamboo Artisans",
    "category": "Bamboo Crafts",
    "image": "https://images.unsplash.com/photo-1583090600102-1c2dfc8c7dce?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1550989460026-5b432a51fa1e?w=800&auto=format&fit=crop",
    "location": "Guwahati",
    "rating": 4.8,
    "tagline": "Sustainable nature crafts",
    "bio": "Eco-friendly bamboo furniture and utility items."
  },
  {
    "id": "727298cc-1b04-42dd-a092-160abe402dde",
    "name": "Tripura Cane Works",
    "category": "Bamboo Crafts",
    "image": "https://images.unsplash.com/photo-1550989460026-5b432a51fa1e?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1583090600102-1c2dfc8c7dce?w=800&auto=format&fit=crop",
    "location": "Agartala",
    "rating": 4.7,
    "tagline": "Woven cane elegance",
    "bio": "Fine cane weaving and handcrafted accessories."
  },
  {
    "id": "382513bb-8c95-4584-ab80-ecaa53b02d9c",
    "name": "Nagaland Bamboo Baskets",
    "category": "Bamboo Crafts",
    "image": "https://images.unsplash.com/photo-1583090600102-1c2dfc8c7dce?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1550989460026-5b432a51fa1e?w=800&auto=format&fit=crop",
    "location": "Dimapur",
    "rating": 4.8,
    "tagline": "Tribal utility crafts",
    "bio": "Traditional utility baskets and containers used by Naga tribes."
  },
  {
    "id": "36a4e719-9c65-481c-bd26-9b921f99c484",
    "name": "Kolkata Leather Crafts",
    "category": "Leather Crafts",
    "image": "https://images.unsplash.com/photo-1590874103328-eaac2cb9e562?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1548624316-23f46f497746?w=800&auto=format&fit=crop",
    "location": "Kolkata",
    "rating": 4.9,
    "tagline": "Premium leather art",
    "bio": "Hand-tooled and embossed leather bags and accessories."
  },
  {
    "id": "5edf7c49-f829-4a71-8d00-84d588863955",
    "name": "Dharavi Leather Goods",
    "category": "Leather Crafts",
    "image": "https://images.unsplash.com/photo-1548624316-23f46f497746?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1590874103328-eaac2cb9e562?w=800&auto=format&fit=crop",
    "location": "Mumbai",
    "rating": 4.8,
    "tagline": "Urban leather flair",
    "bio": "Durable, high-quality leather jackets and accessories."
  },
  {
    "id": "02ae7ae7-59c8-4e0d-a15e-7129051d96d9",
    "name": "Moradabad Brass Works",
    "category": "Home Decor",
    "image": "https://images.unsplash.com/photo-1582216131435-0219c6e3b508?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1591127027503-455c192bd8ec?w=800&auto=format&fit=crop",
    "location": "Moradabad",
    "rating": 4.9,
    "tagline": "The brass city of India",
    "bio": "Exquisite brass artifacts, lamps, and decorative pieces."
  },
  {
    "id": "a0653a66-7048-4bf8-8a85-ff331abbe487",
    "name": "Firozabad Glass Arts",
    "category": "Home Decor",
    "image": "https://images.unsplash.com/photo-1591127027503-455c192bd8ec?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1582216131435-0219c6e3b508?w=800&auto=format&fit=crop",
    "location": "Firozabad",
    "rating": 4.7,
    "tagline": "The glass city",
    "bio": "Handblown glass chandeliers and decorative vases."
  },
  {
    "id": "21be4629-92d2-49e8-8634-e848099c9aa8",
    "name": "Agra Marble Inlay",
    "category": "Home Decor",
    "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=800&auto=format&fit=crop",
    "location": "Agra",
    "rating": 5,
    "tagline": "Stone inlay masterpieces",
    "bio": "Pietra Dura marble inlay work inspired by the Taj Mahal."
  },
  {
    "id": "de84d9fb-0790-4f3a-8a31-8b02119ec8d6",
    "name": "Warli Art Collective",
    "category": "Traditional Art",
    "image": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "location": "Palghar",
    "rating": 4.8,
    "tagline": "Tribal geometric art",
    "bio": "Tribal Warli art reflecting the rhythm of life and nature."
  },
  {
    "id": "12764d85-48e1-4c31-af03-e2a316c36239",
    "name": "Tanjore Painting Studio",
    "category": "Traditional Art",
    "image": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "coverImage": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "location": "Thanjavur",
    "rating": 5,
    "tagline": "Divine gold foil art",
    "bio": "Classical South Indian paintings with real gold foil and semi-precious stones."
  }
];
const products = [
  {
    "id": "4aa356a7-b6be-481b-a050-4e8860d76820",
    "title": "Blue Floral Vase",
    "name": "Blue Floral Vase",
    "price": 1808,
    "image": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop",
    "artisanName": "Khurja Pottery Masters",
    "category": "Pottery"
  },
  {
    "id": "8d305bc8-68c7-4bc2-8ad5-184d56d3e0e9",
    "title": "Ceramic Tea Set",
    "name": "Ceramic Tea Set",
    "price": 4599,
    "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
    "artisanName": "Khurja Pottery Masters",
    "category": "Pottery"
  },
  {
    "id": "d7b11854-fce2-44f6-8fcc-43e0f937f1f3",
    "title": "Hand-painted Planter",
    "name": "Hand-painted Planter",
    "price": 3285,
    "image": "https://images.unsplash.com/photo-1485955900006-d0f28d392b8e?w=800&auto=format&fit=crop",
    "artisanName": "Khurja Pottery Masters",
    "category": "Pottery"
  },
  {
    "id": "eee5e9ce-8553-49c6-ac02-c68ddd6fbc71",
    "title": "Decorative Plate",
    "name": "Decorative Plate",
    "price": 2407,
    "image": "https://images.unsplash.com/photo-1594916843477-947385da41cd?w=800&auto=format&fit=crop",
    "artisanName": "Khurja Pottery Masters",
    "category": "Pottery"
  },
  {
    "id": "8daa48f5-1ed4-4324-8599-0e7c0516c7fc",
    "title": "Blue Pottery Lamp",
    "name": "Blue Pottery Lamp",
    "price": 3847,
    "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop",
    "artisanName": "Jaipur Blue Art",
    "category": "Pottery"
  },
  {
    "id": "cb146b84-5865-41b5-9344-8554f68f6ef2",
    "title": "Ceramic Coasters Set",
    "name": "Ceramic Coasters Set",
    "price": 3440,
    "image": "https://images.unsplash.com/photo-1605335197825-9c88be24db77?w=800&auto=format&fit=crop",
    "artisanName": "Jaipur Blue Art",
    "category": "Pottery"
  },
  {
    "id": "8b79d7ca-9ae5-4579-992e-35cfc6bad7d3",
    "title": "Serving Bowl",
    "name": "Serving Bowl",
    "price": 4149,
    "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
    "artisanName": "Jaipur Blue Art",
    "category": "Pottery"
  },
  {
    "id": "4460b18d-34a1-4493-aa56-62e68cce8fdd",
    "title": "Kasavu Saree",
    "name": "Kasavu Saree",
    "price": 4684,
    "image": "https://images.unsplash.com/photo-1611095973763-414019e72400?w=800&auto=format&fit=crop",
    "artisanName": "Balaramapuram Weaves",
    "category": "Handloom"
  },
  {
    "id": "7f4e6e6e-3ddd-4e3b-a190-ba3ea2d20c83",
    "title": "Mundu & Neriyathu",
    "name": "Mundu & Neriyathu",
    "price": 2939,
    "image": "https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?w=800&auto=format&fit=crop",
    "artisanName": "Balaramapuram Weaves",
    "category": "Handloom"
  },
  {
    "id": "d3194ff6-6ee0-424d-b1f6-e82390d7ef41",
    "title": "Handloom Set Saree",
    "name": "Handloom Set Saree",
    "price": 4421,
    "image": "https://images.unsplash.com/photo-1605001088481-9b1da79b764f?w=800&auto=format&fit=crop",
    "artisanName": "Balaramapuram Weaves",
    "category": "Handloom"
  },
  {
    "id": "a697ee24-fec2-4499-b013-6b446709864d",
    "title": "Woolen Shawl",
    "name": "Woolen Shawl",
    "price": 4655,
    "image": "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&auto=format&fit=crop",
    "artisanName": "Bhujodi Heritage Weavers",
    "category": "Handloom"
  },
  {
    "id": "5bcf3c9d-652c-4e89-a7bd-ddb1ce3438b9",
    "title": "Cotton Stole",
    "name": "Cotton Stole",
    "price": 4841,
    "image": "https://images.unsplash.com/photo-1555529902-5261145633bf?w=800&auto=format&fit=crop",
    "artisanName": "Bhujodi Heritage Weavers",
    "category": "Handloom"
  },
  {
    "id": "1e581f53-7d2b-4051-bc2d-dd768de3f58b",
    "title": "Handwoven Throw",
    "name": "Handwoven Throw",
    "price": 3574,
    "image": "https://images.unsplash.com/photo-1611095973763-414019e72400?w=800&auto=format&fit=crop",
    "artisanName": "Bhujodi Heritage Weavers",
    "category": "Handloom"
  },
  {
    "id": "bba93356-9172-4557-9e9f-5b0a0a034861",
    "title": "Wooden Toy Train",
    "name": "Wooden Toy Train",
    "price": 4476,
    "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop",
    "artisanName": "Channapatna Joy Makers",
    "category": "Wooden Crafts"
  },
  {
    "id": "1a061a2c-a31f-4530-b61c-f479dc898b24",
    "title": "Stacking Rings",
    "name": "Stacking Rings",
    "price": 2186,
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop",
    "artisanName": "Channapatna Joy Makers",
    "category": "Wooden Crafts"
  },
  {
    "id": "8147bc15-fbf9-42ed-8136-6d11dd2112f6",
    "title": "Spinning Tops",
    "name": "Spinning Tops",
    "price": 4629,
    "image": "https://images.unsplash.com/photo-1616429777191-cc11a3c8bb2a?w=800&auto=format&fit=crop",
    "artisanName": "Channapatna Joy Makers",
    "category": "Wooden Crafts"
  },
  {
    "id": "f3c0e643-491f-4342-8066-3d629162acc6",
    "title": "Carved Coffee Table",
    "name": "Carved Coffee Table",
    "price": 1810,
    "image": "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=800&auto=format&fit=crop",
    "artisanName": "Saharanpur Woodworks",
    "category": "Wooden Crafts"
  },
  {
    "id": "ed6b3d3a-8359-4250-8d9e-74e2c2c4d67d",
    "title": "Wooden Wall Panel",
    "name": "Wooden Wall Panel",
    "price": 4552,
    "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&auto=format&fit=crop",
    "artisanName": "Saharanpur Woodworks",
    "category": "Wooden Crafts"
  },
  {
    "id": "69dea612-d6b1-4e8c-bfff-5a1f230f088c",
    "title": "Jewelry Box",
    "name": "Jewelry Box",
    "price": 2872,
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop",
    "artisanName": "Saharanpur Woodworks",
    "category": "Wooden Crafts"
  },
  {
    "id": "af95cb4d-a886-4ab4-b7a6-2dfe5704b750",
    "title": "Sankheda Swing",
    "name": "Sankheda Swing",
    "price": 2353,
    "image": "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=800&auto=format&fit=crop",
    "artisanName": "Sankheda Furniture Crafts",
    "category": "Wooden Crafts"
  },
  {
    "id": "bca8d1a3-7873-4bed-886e-1439d0d7eb09",
    "title": "Decorative Chair",
    "name": "Decorative Chair",
    "price": 5418,
    "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&auto=format&fit=crop",
    "artisanName": "Sankheda Furniture Crafts",
    "category": "Wooden Crafts"
  },
  {
    "id": "cefe41fe-0bdb-4998-af7d-a1bed63bd41d",
    "title": "Lacquer Table",
    "name": "Lacquer Table",
    "price": 3783,
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop",
    "artisanName": "Sankheda Furniture Crafts",
    "category": "Wooden Crafts"
  },
  {
    "id": "164bc1b8-c6c9-4f05-b263-85d09ca43c51",
    "title": "Traditional Stool",
    "name": "Traditional Stool",
    "price": 4746,
    "image": "https://images.unsplash.com/photo-1616429777191-cc11a3c8bb2a?w=800&auto=format&fit=crop",
    "artisanName": "Sankheda Furniture Crafts",
    "category": "Wooden Crafts"
  },
  {
    "id": "cd727a7c-165b-4007-86be-7067e603d679",
    "title": "Oxidized Silver Necklace",
    "name": "Oxidized Silver Necklace",
    "price": 2503,
    "image": "https://images.unsplash.com/photo-1515562141207-8ea4f3c7e7b3?w=800&auto=format&fit=crop",
    "artisanName": "Jaipur Silver Crafts",
    "category": "Jewelry"
  },
  {
    "id": "e7a01720-2310-4400-a22a-c583ff30a366",
    "title": "Amethyst Earrings",
    "name": "Amethyst Earrings",
    "price": 4237,
    "image": "https://images.unsplash.com/photo-1535632066939-bb19c1be3db4?w=800&auto=format&fit=crop",
    "artisanName": "Jaipur Silver Crafts",
    "category": "Jewelry"
  },
  {
    "id": "02b6e175-7a06-4750-8182-721e9a3ee5d2",
    "title": "Silver Bangle Set",
    "name": "Silver Bangle Set",
    "price": 1669,
    "image": "https://images.unsplash.com/photo-1611085583163-fdf6fcb5b8ec?w=800&auto=format&fit=crop",
    "artisanName": "Jaipur Silver Crafts",
    "category": "Jewelry"
  },
  {
    "id": "a292066a-2f4b-475a-a820-46d762b193c7",
    "title": "Dokra Tribal Necklace",
    "name": "Dokra Tribal Necklace",
    "price": 1855,
    "image": "https://images.unsplash.com/photo-1515562141207-8ea4f3c7e7b3?w=800&auto=format&fit=crop",
    "artisanName": "Dokra Brass Jewelry",
    "category": "Jewelry"
  },
  {
    "id": "7eaaea88-daf0-41af-b034-789af076b2b1",
    "title": "Brass Elephant Pendant",
    "name": "Brass Elephant Pendant",
    "price": 1603,
    "image": "https://images.unsplash.com/photo-1535632066939-bb19c1be3db4?w=800&auto=format&fit=crop",
    "artisanName": "Dokra Brass Jewelry",
    "category": "Jewelry"
  },
  {
    "id": "85514a17-4cf4-4d75-a280-c0f38f85441b",
    "title": "Tribal Armlet",
    "name": "Tribal Armlet",
    "price": 2555,
    "image": "https://images.unsplash.com/photo-1611085583163-fdf6fcb5b8ec?w=800&auto=format&fit=crop",
    "artisanName": "Dokra Brass Jewelry",
    "category": "Jewelry"
  },
  {
    "id": "f98e7f26-cba0-44c8-b68b-5fe40e1541a5",
    "title": "Brass Anklet",
    "name": "Brass Anklet",
    "price": 3808,
    "image": "https://images.unsplash.com/photo-1515562141207-8ea4f3c7e7b3?w=800&auto=format&fit=crop",
    "artisanName": "Dokra Brass Jewelry",
    "category": "Jewelry"
  },
  {
    "id": "c826110f-f634-4005-b6b5-022088cca009",
    "title": "Pearl Choker Set",
    "name": "Pearl Choker Set",
    "price": 3497,
    "image": "https://images.unsplash.com/photo-1535632066939-bb19c1be3db4?w=800&auto=format&fit=crop",
    "artisanName": "Hyderabad Pearl Masters",
    "category": "Jewelry"
  },
  {
    "id": "4613bb30-d191-4efd-be8b-a7940dcbf823",
    "title": "Stud Pearl Earrings",
    "name": "Stud Pearl Earrings",
    "price": 3057,
    "image": "https://images.unsplash.com/photo-1611085583163-fdf6fcb5b8ec?w=800&auto=format&fit=crop",
    "artisanName": "Hyderabad Pearl Masters",
    "category": "Jewelry"
  },
  {
    "id": "bb6a8207-40cc-43bc-8dec-2579741e52f2",
    "title": "Classic Pearl Strand",
    "name": "Classic Pearl Strand",
    "price": 4863,
    "image": "https://images.unsplash.com/photo-1515562141207-8ea4f3c7e7b3?w=800&auto=format&fit=crop",
    "artisanName": "Hyderabad Pearl Masters",
    "category": "Jewelry"
  },
  {
    "id": "9f3bbe8e-8f36-4aa9-9af8-e3c822ba835f",
    "title": "Tree of Life Canvas",
    "name": "Tree of Life Canvas",
    "price": 2846,
    "image": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "artisanName": "Madhubani Art Collective",
    "category": "Paintings"
  },
  {
    "id": "452d2d10-e378-443e-83bb-280d0cc25aa1",
    "title": "Krishna Radha Painting",
    "name": "Krishna Radha Painting",
    "price": 2701,
    "image": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "artisanName": "Madhubani Art Collective",
    "category": "Paintings"
  },
  {
    "id": "4bfcfc81-31cb-46fe-92de-5a2a4ebf7016",
    "title": "Peacock Motif Art",
    "name": "Peacock Motif Art",
    "price": 4708,
    "image": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "artisanName": "Madhubani Art Collective",
    "category": "Paintings"
  },
  {
    "id": "40bcd551-65f5-452a-b6bd-a3f24300db9f",
    "title": "Dashavatar Scroll",
    "name": "Dashavatar Scroll",
    "price": 4118,
    "image": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "artisanName": "Pattachitra Canvas",
    "category": "Paintings"
  },
  {
    "id": "8ef484df-3455-46ba-a778-49d40c5d52f9",
    "title": "Jagannath Painting",
    "name": "Jagannath Painting",
    "price": 4556,
    "image": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "artisanName": "Pattachitra Canvas",
    "category": "Paintings"
  },
  {
    "id": "f7ae9946-5d6d-441c-8df5-ecd85679688e",
    "title": "Floral Border Painting",
    "name": "Floral Border Painting",
    "price": 4165,
    "image": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "artisanName": "Pattachitra Canvas",
    "category": "Paintings"
  },
  {
    "id": "7d6b5f81-cec0-4e27-8015-447d995b2bbe",
    "title": "Bridal Banarasi Saree",
    "name": "Bridal Banarasi Saree",
    "price": 3235,
    "image": "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&auto=format&fit=crop",
    "artisanName": "Banarasi Silk Weavers",
    "category": "Textiles"
  },
  {
    "id": "f133b990-99e4-4bcb-8124-81ab650593ca",
    "title": "Silk Brocade Dupatta",
    "name": "Silk Brocade Dupatta",
    "price": 4265,
    "image": "https://images.unsplash.com/photo-1611095973763-414019e72400?w=800&auto=format&fit=crop",
    "artisanName": "Banarasi Silk Weavers",
    "category": "Textiles"
  },
  {
    "id": "8de25bd0-fc55-44b4-b760-6d5e74737a4b",
    "title": "Banarasi Fabric",
    "name": "Banarasi Fabric",
    "price": 2894,
    "image": "https://images.unsplash.com/photo-1612241530263-710c1b0ca131?w=800&auto=format&fit=crop",
    "artisanName": "Banarasi Silk Weavers",
    "category": "Textiles"
  },
  {
    "id": "c3d5a162-1f96-4b89-92fc-c20fd1e5297a",
    "title": "Kalamkari Kurti Fabric",
    "name": "Kalamkari Kurti Fabric",
    "price": 3362,
    "image": "https://images.unsplash.com/photo-1605001088481-9b1da79b764f?w=800&auto=format&fit=crop",
    "artisanName": "Kalamkari Block Prints",
    "category": "Textiles"
  },
  {
    "id": "da903162-bc41-4588-b86a-397245e4e86d",
    "title": "Block Print Saree",
    "name": "Block Print Saree",
    "price": 5416,
    "image": "https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?w=800&auto=format&fit=crop",
    "artisanName": "Kalamkari Block Prints",
    "category": "Textiles"
  },
  {
    "id": "91ee743d-4d61-4e6b-b427-a04fc0143fcf",
    "title": "Cotton Dupatta",
    "name": "Cotton Dupatta",
    "price": 3098,
    "image": "https://images.unsplash.com/photo-1612241530263-710c1b0ca131?w=800&auto=format&fit=crop",
    "artisanName": "Kalamkari Block Prints",
    "category": "Textiles"
  },
  {
    "id": "208d1b46-3a05-4bd1-aeb2-509ea94c78c9",
    "title": "Kanjivaram Silk Saree",
    "name": "Kanjivaram Silk Saree",
    "price": 5240,
    "image": "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&auto=format&fit=crop",
    "artisanName": "Kanjivaram Silk Looms",
    "category": "Textiles"
  },
  {
    "id": "ba0f470c-b4fb-4b8d-9ab3-c47fbb94f9fb",
    "title": "Half Saree Set",
    "name": "Half Saree Set",
    "price": 2347,
    "image": "https://images.unsplash.com/photo-1612241530263-710c1b0ca131?w=800&auto=format&fit=crop",
    "artisanName": "Kanjivaram Silk Looms",
    "category": "Textiles"
  },
  {
    "id": "3e2ab558-4be4-4295-ab47-6d99b5d4463d",
    "title": "Silk Border Fabric",
    "name": "Silk Border Fabric",
    "price": 4179,
    "image": "https://images.unsplash.com/photo-1611095973763-414019e72400?w=800&auto=format&fit=crop",
    "artisanName": "Kanjivaram Silk Looms",
    "category": "Textiles"
  },
  {
    "id": "5e1288bf-f879-40de-8345-19943fcea408",
    "title": "Silk Stole",
    "name": "Silk Stole",
    "price": 4359,
    "image": "https://images.unsplash.com/photo-1584447128309-b66b7a4d1b63?w=800&auto=format&fit=crop",
    "artisanName": "Kanjivaram Silk Looms",
    "category": "Textiles"
  },
  {
    "id": "41bc80c7-4f2f-463d-8256-dd5a6ed49ce2",
    "title": "Bamboo Easy Chair",
    "name": "Bamboo Easy Chair",
    "price": 2602,
    "image": "https://images.unsplash.com/photo-1550989460026-5b432a51fa1e?w=800&auto=format&fit=crop",
    "artisanName": "Assam Bamboo Artisans",
    "category": "Bamboo Crafts"
  },
  {
    "id": "c679e07b-e44e-480a-8961-026610c09d51",
    "title": "Bamboo Planter Set",
    "name": "Bamboo Planter Set",
    "price": 3839,
    "image": "https://images.unsplash.com/photo-1583090600102-1c2dfc8c7dce?w=800&auto=format&fit=crop",
    "artisanName": "Assam Bamboo Artisans",
    "category": "Bamboo Crafts"
  },
  {
    "id": "90cc9b03-fe87-4805-9413-2fb90c9851a3",
    "title": "Bamboo Lampshade",
    "name": "Bamboo Lampshade",
    "price": 4821,
    "image": "https://images.unsplash.com/photo-1583090600102-1c2dfc8c7dce?w=800&auto=format&fit=crop",
    "artisanName": "Assam Bamboo Artisans",
    "category": "Bamboo Crafts"
  },
  {
    "id": "359e8c28-5a05-48a5-b24f-0bf37dca1be8",
    "title": "Cane Basket",
    "name": "Cane Basket",
    "price": 3199,
    "image": "https://images.unsplash.com/photo-1583090600102-1c2dfc8c7dce?w=800&auto=format&fit=crop",
    "artisanName": "Tripura Cane Works",
    "category": "Bamboo Crafts"
  },
  {
    "id": "e40681ae-7b58-416b-8146-80fcf3ef4e09",
    "title": "Cane Tray Set",
    "name": "Cane Tray Set",
    "price": 2714,
    "image": "https://images.unsplash.com/photo-1550989460026-5b432a51fa1e?w=800&auto=format&fit=crop",
    "artisanName": "Tripura Cane Works",
    "category": "Bamboo Crafts"
  },
  {
    "id": "903323d9-608a-4d20-ae5e-574776770ad5",
    "title": "Handwoven Cane Mat",
    "name": "Handwoven Cane Mat",
    "price": 2288,
    "image": "https://images.unsplash.com/photo-1583090600102-1c2dfc8c7dce?w=800&auto=format&fit=crop",
    "artisanName": "Tripura Cane Works",
    "category": "Bamboo Crafts"
  },
  {
    "id": "326ce7b1-80a5-4860-bc7d-b651259424e9",
    "title": "Harvest Basket",
    "name": "Harvest Basket",
    "price": 5422,
    "image": "https://images.unsplash.com/photo-1550989460026-5b432a51fa1e?w=800&auto=format&fit=crop",
    "artisanName": "Nagaland Bamboo Baskets",
    "category": "Bamboo Crafts"
  },
  {
    "id": "f34bd165-3d46-4bed-9913-37d04b8c96bd",
    "title": "Bamboo Container",
    "name": "Bamboo Container",
    "price": 2553,
    "image": "https://images.unsplash.com/photo-1583090600102-1c2dfc8c7dce?w=800&auto=format&fit=crop",
    "artisanName": "Nagaland Bamboo Baskets",
    "category": "Bamboo Crafts"
  },
  {
    "id": "4b092341-bfa9-4f35-97f6-186af3ef01df",
    "title": "Decorative Bamboo Vase",
    "name": "Decorative Bamboo Vase",
    "price": 5359,
    "image": "https://images.unsplash.com/photo-1550989460026-5b432a51fa1e?w=800&auto=format&fit=crop",
    "artisanName": "Nagaland Bamboo Baskets",
    "category": "Bamboo Crafts"
  },
  {
    "id": "c7ffcaca-86cb-4eca-891c-1cf8e5ab26a7",
    "title": "Embossed Leather Tote",
    "name": "Embossed Leather Tote",
    "price": 2219,
    "image": "https://images.unsplash.com/photo-1590874103328-eaac2cb9e562?w=800&auto=format&fit=crop",
    "artisanName": "Kolkata Leather Crafts",
    "category": "Leather Crafts"
  },
  {
    "id": "d1dd8fe5-4cee-44ca-82f8-aa45160d0c4e",
    "title": "Leather Wallet",
    "name": "Leather Wallet",
    "price": 3254,
    "image": "https://images.unsplash.com/photo-1548624316-23f46f497746?w=800&auto=format&fit=crop",
    "artisanName": "Kolkata Leather Crafts",
    "category": "Leather Crafts"
  },
  {
    "id": "e1c84822-756e-40db-be17-8be7087efb92",
    "title": "Messenger Bag",
    "name": "Messenger Bag",
    "price": 5322,
    "image": "https://images.unsplash.com/photo-1590874103328-eaac2cb9e562?w=800&auto=format&fit=crop",
    "artisanName": "Kolkata Leather Crafts",
    "category": "Leather Crafts"
  },
  {
    "id": "b817d550-9bc8-46f2-8b43-10a3b6559796",
    "title": "Classic Leather Jacket",
    "name": "Classic Leather Jacket",
    "price": 2076,
    "image": "https://images.unsplash.com/photo-1548624316-23f46f497746?w=800&auto=format&fit=crop",
    "artisanName": "Dharavi Leather Goods",
    "category": "Leather Crafts"
  },
  {
    "id": "99afc019-a161-4852-8591-861c593c38e0",
    "title": "Leather Belt",
    "name": "Leather Belt",
    "price": 4100,
    "image": "https://images.unsplash.com/photo-1590874103328-eaac2cb9e562?w=800&auto=format&fit=crop",
    "artisanName": "Dharavi Leather Goods",
    "category": "Leather Crafts"
  },
  {
    "id": "99715ab8-9eaa-49c6-b05e-8b58ee72b144",
    "title": "Travel Duffel",
    "name": "Travel Duffel",
    "price": 4214,
    "image": "https://images.unsplash.com/photo-1548624316-23f46f497746?w=800&auto=format&fit=crop",
    "artisanName": "Dharavi Leather Goods",
    "category": "Leather Crafts"
  },
  {
    "id": "3c012adf-0229-4a2d-8722-1d4c8ffe556b",
    "title": "Brass Elephant Showpiece",
    "name": "Brass Elephant Showpiece",
    "price": 2657,
    "image": "https://images.unsplash.com/photo-1582216131435-0219c6e3b508?w=800&auto=format&fit=crop",
    "artisanName": "Moradabad Brass Works",
    "category": "Home Decor"
  },
  {
    "id": "2d23beb2-2047-4f33-bb1b-7f4dcc3d49d9",
    "title": "Vintage Brass Lamp",
    "name": "Vintage Brass Lamp",
    "price": 1774,
    "image": "https://images.unsplash.com/photo-1591127027503-455c192bd8ec?w=800&auto=format&fit=crop",
    "artisanName": "Moradabad Brass Works",
    "category": "Home Decor"
  },
  {
    "id": "d8957f1d-48a4-46fd-ab12-1e94ab8f39ba",
    "title": "Brass Wall Sconce",
    "name": "Brass Wall Sconce",
    "price": 4459,
    "image": "https://images.unsplash.com/photo-1582216131435-0219c6e3b508?w=800&auto=format&fit=crop",
    "artisanName": "Moradabad Brass Works",
    "category": "Home Decor"
  },
  {
    "id": "dad2cdb4-76fb-4941-878d-f6cccaacf4ab",
    "title": "Glass Chandelier",
    "name": "Glass Chandelier",
    "price": 3377,
    "image": "https://images.unsplash.com/photo-1591127027503-455c192bd8ec?w=800&auto=format&fit=crop",
    "artisanName": "Firozabad Glass Arts",
    "category": "Home Decor"
  },
  {
    "id": "a51d3237-a89b-4752-9997-cb99ccd94319",
    "title": "Colorful Glass Vase",
    "name": "Colorful Glass Vase",
    "price": 4479,
    "image": "https://images.unsplash.com/photo-1582216131435-0219c6e3b508?w=800&auto=format&fit=crop",
    "artisanName": "Firozabad Glass Arts",
    "category": "Home Decor"
  },
  {
    "id": "950e7cf7-b7b6-4d05-8c66-008326ac4c8d",
    "title": "Glass Paperweight",
    "name": "Glass Paperweight",
    "price": 5414,
    "image": "https://images.unsplash.com/photo-1591127027503-455c192bd8ec?w=800&auto=format&fit=crop",
    "artisanName": "Firozabad Glass Arts",
    "category": "Home Decor"
  },
  {
    "id": "e03362fb-d549-4305-858c-bd25dccd6719",
    "title": "Marble Inlay Table Top",
    "name": "Marble Inlay Table Top",
    "price": 5282,
    "image": "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=800&auto=format&fit=crop",
    "artisanName": "Agra Marble Inlay",
    "category": "Home Decor"
  },
  {
    "id": "5c47bd63-475a-4bbf-8414-5d32291e183d",
    "title": "Taj Mahal Replica",
    "name": "Taj Mahal Replica",
    "price": 1608,
    "image": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=800&auto=format&fit=crop",
    "artisanName": "Agra Marble Inlay",
    "category": "Home Decor"
  },
  {
    "id": "41ce7300-7a10-400d-85c9-d7ec56be908c",
    "title": "Marble Coaster Set",
    "name": "Marble Coaster Set",
    "price": 4003,
    "image": "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=800&auto=format&fit=crop",
    "artisanName": "Agra Marble Inlay",
    "category": "Home Decor"
  },
  {
    "id": "306aa4eb-9b34-448d-989b-d7049652d9ec",
    "title": "Warli Village Painting",
    "name": "Warli Village Painting",
    "price": 4851,
    "image": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "artisanName": "Warli Art Collective",
    "category": "Traditional Art"
  },
  {
    "id": "2ac15424-c8e8-4ea9-b4b8-5f159323ba51",
    "title": "Warli Painted Terracotta Pot",
    "name": "Warli Painted Terracotta Pot",
    "price": 4037,
    "image": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "artisanName": "Warli Art Collective",
    "category": "Traditional Art"
  },
  {
    "id": "da087a75-9f72-44d6-941e-7457cdaece02",
    "title": "Warli Canvas Tote",
    "name": "Warli Canvas Tote",
    "price": 3576,
    "image": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "artisanName": "Warli Art Collective",
    "category": "Traditional Art"
  },
  {
    "id": "66f415f2-26c0-4f1b-a5a4-110263deedf5",
    "title": "Ganesha Tanjore Painting",
    "name": "Ganesha Tanjore Painting",
    "price": 3286,
    "image": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "artisanName": "Tanjore Painting Studio",
    "category": "Traditional Art"
  },
  {
    "id": "ecfcf463-9ea8-45b1-8de6-e84d42e84532",
    "title": "Balaji Tanjore Art",
    "name": "Balaji Tanjore Art",
    "price": 5273,
    "image": "https://images.unsplash.com/photo-1578301978693-851568c0953a?w=800&auto=format&fit=crop",
    "artisanName": "Tanjore Painting Studio",
    "category": "Traditional Art"
  },
  {
    "id": "c06e15c2-a1d9-4b0a-9882-9c4883271dd0",
    "title": "Saraswati Gold Foil Frame",
    "name": "Saraswati Gold Foil Frame",
    "price": 5249,
    "image": "https://images.unsplash.com/photo-1580136608269-1c91da65eeb1?w=800&auto=format&fit=crop",
    "artisanName": "Tanjore Painting Studio",
    "category": "Traditional Art"
  }
];
const stories = [];
module.exports = { artisans, products, stories };