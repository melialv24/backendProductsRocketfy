import { ProductController } from '../../controllers/index';
import express from 'express';
import { MongoProductRepository } from '../../repositories';
import { ProductUseCase } from '../../../application/useCases/products/products';

const router = express.Router();
/**
 *  Initialize the repository
 */

const mongoProductRepository = new MongoProductRepository()
/**
 *  Initialize use Cases
 */
const productUseCase = new ProductUseCase(mongoProductRepository)

/**
 *  Initialize controller
 */
const productCtrl = new ProductController(productUseCase)


router.post('/createProduct', productCtrl.createCtrl);
router.post('/editProduct', productCtrl.editCtrl);
router.delete('/delete/:id', productCtrl.deleteProductCtrl);
router.post('/', productCtrl.productsByParams);
router.get('/', productCtrl.productsCtrl);
router.get('/getProductById/:id', productCtrl.productByIdCtrl);
router.get('/getCategories', productCtrl.getCategoriesCtrl)

export default router;