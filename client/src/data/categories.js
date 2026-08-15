// Single source of truth for the category → subcategory structure.
// Both the customer navbar filter and the Owner Dashboard's Add/Edit
// Product forms read from this file, so a product's category/subcategory
// is always picked from a dropdown — never free-typed — which keeps the
// data consistent (no typos like "watchs" vs "Watches").
//
// To add/rename a category or subcategory later, edit this file only —
// both places update automatically.

const CATEGORY_TREE = [
  {
    name: "Fragrance",
    subcategories: ["Body Spray", "Perfume", "Attar", "Pocket Perfume", "Room Spray"],
  },
  {
    name: "Dry Fruits and Chocolates",
    subcategories: ["Almond", "Cashew", "Black Kismis", "Chocolates", "Marshmallow"],
  },
  {
    name: "Toys, Gifts & Decor",
    subcategories: ["Car Toy", "Helicopter Toy", "Dancing Cactus", "Laughing Buddha"],
  },
  {
    name: "Watches & Clocks",
    subcategories: [
      "Men's Watch (Smart & Analog)",
      "Women's Watch (Smart & Analog)",
      "Boy's Watch (Smart & Analog)",
      "Girl's Watch (Smart & Analog)",
      "Wall Clock",
      "Alarm Clock",
    ],
  },
  {
    name: "Personal Care & Grooming",
    subcategories: [
      "Trimmer",
      "Scissor",
      "Nail Cutter",
      "Hair Gel",
      "Yardley Powder",
      "Enchanteur Powder",
      "Medicated Oil (Thailam)",
      "Sanitizer",
      "Shower Gel",
    ],
  },
  {
    name: "Personal Accessories",
    subcategories: ["Sunglasses", "Wallet", "Belt", "Umbrella", "Helmet"],
  },
  {
    name: "Electronics & Gadgets",
    subcategories: [
      "Bluetooth Speaker",
      "Wired Headphones",
      "Earpods",
      "Wireless Mouse",
      "Torch Light",
      "Headlight",
      "Laser Light",
      "Binoculars",
      "Battery",
      "Charger",
      "Mosquito Bat",
      "LED Bulb",
    ],
  },
  {
    name: "Office & Utility Supplies",
    subcategories: [
      "Scientific Calculator",
      "Electronic Calculator",
      "Stapler",
      "Bill Numbering Machine",
      "Digital Weighing Machine",
    ],
  },
  {
    name: "Household & Kitchen Appliances",
    subcategories: [
      "Kettle",
      "Flask",
      "Mini Knife (Vegetables & Fruits)",
      "Large Knife (Meat & Chicken)",
      "Lock",
      "TV Remote",
    ],
  },
];

export default CATEGORY_TREE;
