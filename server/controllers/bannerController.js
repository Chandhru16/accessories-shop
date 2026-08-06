const Banner = require("../models/Banner");

const MAX_BANNERS = 20;

// GET /api/banners (public — used by the customer home page carousel)
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners.", error: err.message });
  }
};

// POST /api/owner/banners (owner only)
exports.addBanner = async (req, res) => {
  try {
    const count = await Banner.countDocuments();
    if (count >= MAX_BANNERS) {
      return res
        .status(400)
        .json({ message: `You can only have up to ${MAX_BANNERS} promotion banners.` });
    }
    const { imageUrl, linkUrl } = req.body;
    const banner = await Banner.create({
      imageUrl,
      linkUrl: linkUrl || null,
      order: count,
    });
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: "Failed to add banner.", error: err.message });
  }
};

// PUT /api/owner/banners/:id (owner only)
exports.updateBanner = async (req, res) => {
  try {
    const { imageUrl, linkUrl } = req.body;
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { imageUrl, linkUrl: linkUrl || null },
      { new: true, runValidators: true }
    );
    if (!banner) return res.status(404).json({ message: "Banner not found." });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Failed to update banner.", error: err.message });
  }
};

// DELETE /api/owner/banners/:id (owner only)
exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Banner deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete banner.", error: err.message });
  }
};
