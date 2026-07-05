const { Router } = require('express');
const ghlController = require('../controllers/ghlController');
const codeAuth = require('../middleware/codeAuth');

const router = Router();

router.post('/calculate', codeAuth, ghlController.calculate);

module.exports = router;
