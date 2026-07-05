const { Product, User } = require('../models');

exports.getAll = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  const allowed = [10, 20, 50, 100];
  const safeLimit = allowed.includes(limit) ? limit : 10;

  const { count, rows } = await Product.findAndCountAll({
    include: ['user'],
    limit: safeLimit,
    offset,
    order: [['id', 'DESC']],
  });

  res.json({ data: rows, total: count, limit: safeLimit, offset });
};

exports.getById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, { include: ['user'] });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

exports.create = async (req, res) => {
  const user = await User.findByPk(req.body.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await product.update(req.body);
  res.json(product);
};

exports.upload = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Dosya gerekli' });

  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: 'userId gerekli' });

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const XLSX = require('xlsx');
  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const products = rows.map((row) => ({
    productId: String(row.product_id ?? ''),
    imageUrl: row.image_url ?? null,
    name: String(row.name ?? ''),
    minCost: row.min_cost ? parseFloat(row.min_cost) : null,
    maxCost: row.max_cost ? parseFloat(row.max_cost) : null,
    userId: parseInt(userId, 10),
  }));

  const created = await Product.bulkCreate(products);
  res.status(201).json({ message: `${created.length} ürün yüklendi` });
};

exports.remove = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await product.destroy();
  res.status(204).end();
};
