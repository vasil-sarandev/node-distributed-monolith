import { IProductRestockedMessage } from '../../../shared/kafka/messages/product-restocked.model';
import { Topics } from '../../../shared/kafka/topics';
import { kafkaProducer } from '../../lib/kafka';
import { IProduct } from './product.model';
import { ProductRepository, productRepository } from './product.repository';

class ProductService {
  private repository: ProductRepository;

  constructor(repository = productRepository) {
    this.repository = repository;
  }

  getAllProducts = async (): Promise<IProduct[]> => {
    return this.repository.getAllProducts();
  };

  getProductById = async (id: number): Promise<IProduct | null> => {
    return this.repository.getProductById({ id });
  };

  handleProductRestock = async ({ product, quantity }: { product: IProduct; quantity: number }) => {
    const productRestockMessage: IProductRestockedMessage = {
      id: product.id,
      name: product.name,
      quantity,
    };
    return kafkaProducer.send({ topic: Topics.PRODUCT_RESTOCKED, message: productRestockMessage });
  };
}

export const productService = new ProductService();
