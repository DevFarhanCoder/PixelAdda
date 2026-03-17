const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");
const { getSignedDownloadUrl } = require("../utils/r2Storage");
const {
  getDownloadOptions,
  getMimeType,
} = require("../utils/fileFormatHandler");
const archiver = require("archiver");

// Get download options for a product
router.get("/:productId/options", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const options = getDownloadOptions(product);
    res.json({ options });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download product files
router.post("/:productId/download", protect, async (req, res) => {
  try {
    const { optionKey, size } = req.body; // optionKey: 'vector_eps', 'single_psd', etc.
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const options = getDownloadOptions(product);
    const selectedOption = options.find(
      (opt) => opt.key === optionKey || opt.type === "single",
    );

    if (!selectedOption) {
      return res.status(400).json({ error: "Invalid download option" });
    }

    // Increment download count
    product.downloads += 1;
    await product.save();

    // If single file, return download URL
    if (selectedOption.files.length === 1) {
      const file = selectedOption.files[0];
      const downloadUrl = await getSignedDownloadUrl(file.key, file.fileName);

      return res.json({
        type: "single",
        url: downloadUrl,
        fileName: file.fileName,
        mimeType: getMimeType(file.format),
      });
    }

    // If multiple files, create ZIP
    const downloadUrls = await Promise.all(
      selectedOption.files.map(async (file) => ({
        ...file,
        url: await getSignedDownloadUrl(file.key, file.fileName),
      })),
    );

    res.json({
      type: "bundle",
      files: downloadUrls,
      bundleName: `${product.title}_${optionKey}.zip`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
