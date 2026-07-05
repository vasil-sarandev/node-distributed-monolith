import { IProductRestockedMessage } from '@shared/kafka/messages/product-restocked.model';

export const handleMessage = async (message: IProductRestockedMessage) => {
  console.log(
    `Sending marketing campaigns to customers subscribed to the restock of ${message.name} after ${message.quantity} items were restocked`
  );
};
