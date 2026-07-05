const { Product, User } = require('../models');

exports.getAll = async (req, res) => {
  const products = await Product.findAll({ include: ['user'] });
  res.json(products);
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

exports.remove = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  await product.destroy();
  res.status(204).end();
};
