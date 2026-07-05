const { Router } = require('express');
const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');

const router = Router();

router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;
