const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function generateRefToken() {
  return crypto.randomBytes(40).toString('hex');
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refToken = generateRefToken();

  await user.update({ token, refToken });

  res.json({ token, refToken, user: { id: user.id, email: user.email, username: user.username } });
};

exports.refresh = async (req, res) => {
  const { refToken } = req.body;
  if (!refToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  const user = await User.findOne({ where: { refToken } });
  if (!user) return res.status(401).json({ error: 'Invalid refresh token' });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const newRefToken = generateRefToken();

  await user.update({ token, refToken: newRefToken });

  res.json({ token, refToken: newRefToken, user: { id: user.id, email: user.email, username: user.username } });
};
