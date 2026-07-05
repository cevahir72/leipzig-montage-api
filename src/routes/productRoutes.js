const { Router } = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.get('/', auth, productController.getAll);
router.get('/:id', auth, productController.getById);
router.post('/', auth, validateProduct, productController.create);
router.put('/:id', auth, validateProduct, productController.update);
router.delete('/:id', auth, productController.remove);
router.post('/upload', auth, upload.single('file'), productController.upload);

module.exports = router;
