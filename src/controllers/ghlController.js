const { Product } = require('../models');

exports.calculate = async (req, res) => {
  try {
    // 1. Gelen veriyi al
    let rawProductList = req.body.product_list;
    console.log("Gelen Raw Data:", rawProductList);

    // 2. Eğer bir string ise virgüllerden ayır ve diziye çevir
    let product_list = [];
    if (typeof rawProductList === 'string') {
        product_list = rawProductList.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(rawProductList)) {
        product_list = rawProductList;
    }

    // 3. Eğer dizi boşsa hata dön
    if (product_list.length === 0) {
      return res.status(400).json({ error: 'product_list array required', received: req.body });
    }

    let totalMin = 0;
    let totalMax = 0;
    const calculated = [];
    const notCalculated = [];

    // 4. Döngü
    for (const pid of product_list) {
      // Sequelize sorgusu
      const product = await Product.findOne({ where: { productId: String(pid) } });

      if (product) {
        totalMin += Number(product.minCost) || 0;
        totalMax += Number(product.maxCost) || 0;
        calculated.push({ productId: pid, minCost: product.minCost, maxCost: product.maxCost });
      } else {
        notCalculated.push(pid);
      }
    }

    // 5. Başarılı yanıt
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
