const { Product } = require('../models');

exports.calculate = async (req, res) => {
  try {
    let { product_list } = req.body;

    if (typeof product_list === 'string') {
      product_list = product_list.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (Array.isArray(product_list) && product_list.length === 1 && typeof product_list[0] === 'string' && product_list[0].includes(',')) {
      product_list = product_list[0].split(',').map(s => s.trim()).filter(Boolean);
    }

    if (!Array.isArray(product_list) || product_list.length === 0) {
      return res.status(400).json({ error: 'product_list array required' });
    }

    let totalMin = 0;
    let totalMax = 0;
    const calculated = [];
    const notCalculated = [];

    for (const pid of product_list) {
      const product = await Product.findOne({ where: { productId: String(pid) } });

      if (product) {
        totalMin += product.minCost || 0;
        totalMax += product.maxCost || 0;
        calculated.push({ productId: pid, minCost: product.minCost, maxCost: product.maxCost });
      } else {
        notCalculated.push(pid);
      }
    }

    res.json({
      total_min: totalMin,
      total_max: totalMax,
      calculated_products: calculated,
      not_calculated_ids: notCalculated,
    });
  } catch (error) {
    console.error('Hesaplama hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
};
