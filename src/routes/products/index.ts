import { ProductsController } from '../../controllers/index';
import express from 'express';

const router = express.Router();

router.post('/createProduct', ProductsController.create);
router.post('/editProduct', ProductsController.edit);
router.delete('/delete/:id', ProductsController.deleteProduct);
router.post('/', ProductsController.products);
router.get('/getProductById/:id', ProductsController.productById);
router.get('/getCategories', ProductsController.getCategories)

export default router;