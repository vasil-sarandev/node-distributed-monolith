import { beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.hoisted(() => vi.fn());

vi.mock('@api/lib/kafka', () => ({
  apiKafkaProducer: { send },
}));

import { productService } from '../modules/product/product.service';
import { Topics } from '@shared/kafka/topics';

describe('ProductService', () => {
  beforeEach(() => {
    send.mockClear();
  });

  it('publishes a product restock message', async () => {
    await productService.handleProductRestock({
      product: {
        id: 1,
        name: 'Widget',
        description: 'A widget',
        price: 10,
      },
      quantity: 60,
    });

    expect(send).toHaveBeenCalledWith({
      topic: Topics.PRODUCT_RESTOCKED,
      message: { id: 1, name: 'Widget', quantity: 60 },
    });
  });
});
