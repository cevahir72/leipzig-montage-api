module.exports = (req, res, next) => {
  const { productId, name, minCost, maxCost } = req.body;
  const errors = [];

  if (!productId && productId !== 0) errors.push('productId required');
  if (!name) errors.push('name required');
  if (minCost === undefined || minCost === null || minCost === '') errors.push('minCost required');
  if (maxCost === undefined || maxCost === null || maxCost === '') errors.push('maxCost required');

  if (errors.length) {
    return res.status(400).json({ error: errors.join(', ') });
  }
  next();
};
