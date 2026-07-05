const { Router } = require('express');
const ghlRoutes = require('./ghlRoutes');

const router = Router();

router.use('/ghl', ghlRoutes);

module.exports = router;
