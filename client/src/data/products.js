// Temporary mock data — used until the backend product API is connected.
// Once /server is running and the owner adds real products, ProductCard/
// CustomerHome automatically switches to fetching from GET /api/products.

const products = [
  {
    _id: "p1",
    name: "Classic Attar Bottle",
    description: "Long-lasting alcohol-free attar in a traditional glass bottle.",
    price: 249,
    mrp: 349,
    category: "Fragrance",
    subcategory: "Attar",
    stock: 20,
    imgUrls: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400",
    ],
  },
  {
    _id: "p2",
    name: "Men's Analog Wrist Watch",
    description: "Classic leather-strap analog watch, water resistant.",
    price: 899,
    mrp: 1299,
    category: "Watches & Clocks",
    subcategory: "Men's Watch (Smart & Analog)",
    stock: 10,
    imgUrls: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400",
    ],
  },
  {
    _id: "p3",
    name: "Bluetooth Speaker Mini",
    description: "Compact portable speaker with rich bass and 8-hour battery.",
    price: 799,
    mrp: 999,
    category: "Electronics & Gadgets",
    subcategory: "Bluetooth Speaker",
    stock: 15,
    imgUrls: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400",
    ],
  },
  {
    _id: "p4",
    name: "Classic Aviator Sunglasses",
    description: "UV protected classic aviator sunglasses.",
    price: 599,
    mrp: null,
    category: "Personal Accessories",
    subcategory: "Sunglasses",
    stock: 12,
    imgUrls: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400",
    ],
  },
];

export default products;
