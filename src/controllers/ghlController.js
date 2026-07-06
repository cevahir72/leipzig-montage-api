const { Product } = require('../models');

exports.calculate = async (req, res) => {
  try {
    let rawData = req.body.product_list;
    let product_list = [];
      console.log('Gelen veri:', rawData);
      console.log('Gelen veri tipi:', typeof rawData);
    // 1. Eğer dizi geliyorsa ve ilk eleman virgül içeriyorsa, o elemanı parçala
    if (Array.isArray(rawData) && rawData.length > 0 && typeof rawData[0] === 'string' && rawData[0].includes(',')) {
        product_list = rawData[0].split(',').map(s => s.trim()).filter(Boolean);
    } 
    // 2. Eğer string geliyorsa direkt parçala (eski GHL formatı için)
    else if (typeof rawData === 'string') {
        product_list = rawData.split(',').map(s => s.trim()).filter(Boolean);
    } 
    // 3. Eğer zaten düzgün dizi geliyorsa (örneğin ["123", "456"])
    else if (Array.isArray(rawData)) {
        product_list = rawData;
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
