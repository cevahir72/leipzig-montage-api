const { User, Product } = require('../models');

exports.getAll = async (req, res) => {
  const users = await User.findAll({ include: ['products'] });
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: ['products'] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.create = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

exports.update = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await user.update(req.body);
  res.json(user);
};

exports.remove = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await Product.destroy({ where: { userId: user.id } });
  await user.destroy();
  res.status(204).end();
};
