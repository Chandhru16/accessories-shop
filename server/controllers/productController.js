const Product = require("../models/Product");

// GET /api/products (public — used by customer home page)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products.", error: err.message });
  }
};

// POST /api/owner/products (owner only)
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, stock, imgUrls } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory,
      stock,
      imgUrls,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to add product.", error: err.message });
  }
};

// DELETE /api/owner/products/:id (owner only)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product.", error: err.message });
  }
};
