const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadToR2, getSignedDownloadUrl, getSignedViewUrl } = require('../utils/r2Storage');

const upload = multer({ storage: multer.memoryStorage() });

// Helper function to add signed URLs to product
const addSignedUrlsToProduct = async (product) => {
  const productObj = product.toObject ? product.toObject() : product;
  
  if (productObj.previewImages && productObj.previewImages.length > 0) {
    productObj.previewImagesUrls = await Promise.all(
      productObj.previewImages.map(key => getSignedViewUrl(key))
    );
  }
  
  return productObj;
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    
    // Add signed URLs to all products
    const productsWithUrls = await Promise.all(
      products.map(product => addSignedUrlsToProduct(product))
    );
    
    res.json(productsWithUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productWithUrls = await addSignedUrlsToProduct(product);
    res.json(productWithUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (Admin only)
router.post('/', protect, adminOnly, upload.fields([
  { name: 'previewImages', maxCount: 5 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    if (!req.files || !req.files.file || !req.files.file[0]) {
      return res.status(400).json({ error: 'Product file is required' });
    }

    const file = req.files.file[0];
    const fileKey = await uploadToR2(file, 'products');

    const previewImages = [];
    if (req.files.previewImages) {
      for (const image of req.files.previewImages) {
        const imageKey = await uploadToR2(image, 'previews');
        previewImages.push(imageKey);
      }
    }

    const product = await Product.create({
      title,
      description,
      category,
      price,
      previewImages,
      fileKey,
      fileName: file.originalname,
      fileSize: file.size
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (Admin only)
router.put('/:id', protect, adminOnly, upload.fields([
  { name: 'previewImages', maxCount: 5 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category, price, isActive } = req.body;
    const updateData = { title, description, category, price, isActive };

    if (req.files && req.files.file && req.files.file[0]) {
      const file = req.files.file[0];
      const fileKey = await uploadToR2(file, 'products');
      updateData.fileKey = fileKey;
      updateData.fileName = file.originalname;
      updateData.fileSize = file.size;
    }

    if (req.files && req.files.previewImages) {
      const previewImages = [];
      for (const image of req.files.previewImages) {
        const imageKey = await uploadToR2(image, 'previews');
        previewImages.push(imageKey);
      }
      updateData.previewImages = previewImages;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get download URL (Protected - only for purchased products)
router.get('/:id/download', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has purchased this product
    if (!req.user.purchasedProducts.includes(product._id.toString()) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You have not purchased this product' });
    }

    const downloadUrl = await getSignedDownloadUrl(product.fileKey, product.fileName);
    
    // Increment download count
    product.downloads += 1;
    await product.save();

    res.json({ downloadUrl, fileName: product.fileName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
