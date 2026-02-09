const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

// Admin dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments({ status: 'paid' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products for admin
router.get('/products', protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
