import { Router } from 'express';
import { productController } from './product.controller';

export const productRouter = Router();

productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getProductById);
productRouter.post('/:id/restock', productController.handleProductRestock);
