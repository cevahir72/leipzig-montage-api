module.exports = (req, res, next) => {
  const code = req.headers['code'];
  if (!code || code !== process.env.CODE) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
