import { IProductRestockedMessage } from '@shared/kafka/messages/product-restocked.model';
import { Topics } from '@shared/kafka/topics';
import { handleMessage } from '../handle-message';
import { productRestockedKafkaConsumer } from './kafka';

export const setupConsumer = async (): Promise<void> => {
  console.log('Setting up product restocked consumer...');
  await productRestockedKafkaConsumer.connect();
  await productRestockedKafkaConsumer.run<IProductRestockedMessage>({
    topic: Topics.PRODUCT_RESTOCKED,
    eachMessage: async (message) => {
      handleMessage(message);
    },
  });
};
