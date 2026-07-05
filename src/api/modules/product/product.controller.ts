import { NextFunction, Request, Response } from 'express';
import { IProduct } from './product.model';
import { productService } from './product.service';
import { AppError } from '@api/middlewares/error.middleware';

class ProductController {
  constructor() {}

  getAllProducts = async (req: Request, res: Response<IProduct[]>, next: NextFunction) => {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  getProductById = async (req: Request<{ id: string }>, res: Response<IProduct>, next: NextFunction) => {
    try {
      const product = await productService.getProductById(parseInt(req.params.id));
      if (product) {
        return res.status(200).json(product);
      }
      throw new AppError(404, 'Product not found');
    } catch (err) {
      next(err);
    }
  };

  handleProductRestock = async (req: Request<{ id: string }, {}, { quantity: number }>, res: Response, next: NextFunction) => {
    try {
      const product = await productService.getProductById(parseInt(req.params.id));
      if (!product) {
        throw new AppError(404, 'Product not found');
      }
      await productService.handleProductRestock({ product, quantity: req.body.quantity });
      return res.status(200).json({ message: 'Product restock message has been sent for processing' });
    } catch (err) {
      next(err);
    }
  };
}

export const productController = new ProductController();
