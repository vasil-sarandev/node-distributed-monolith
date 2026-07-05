import { IProduct } from '../../../api/modules/product/product.model';

export type IProductRestockedMessage = Pick<IProduct, 'id' | 'name'> & {
  quantity: number;
};
