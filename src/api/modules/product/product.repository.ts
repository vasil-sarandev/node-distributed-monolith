import { IProduct } from './product.model';

const PRODUCTS_MOCK: IProduct[] = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description 2',
    price: 200,
  },
];

export class ProductRepository {
  constructor() {}

  getAllProducts = async (): Promise<IProduct[]> => {
    return PRODUCTS_MOCK;
  };

  getProductById = async (filter: { id: number }): Promise<IProduct | null> => {
    return PRODUCTS_MOCK.find((product) => product.id === filter.id) ?? null;
  };
}

export const productRepository = new ProductRepository();
