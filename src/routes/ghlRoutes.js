const { Router } = require('express');
const ghlController = require('../controllers/ghlController');

const router = Router();

router.post('/calculate', ghlController.calculate);

module.exports = router;
