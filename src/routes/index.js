const { Router } = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const authRoutes = require('./authRoutes');
const ghlRoutes = require('./ghlRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/ghl', ghlRoutes);

module.exports = router;
