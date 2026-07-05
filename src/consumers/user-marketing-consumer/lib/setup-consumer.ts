import { IUserMarketingConsentMessage } from '@shared/kafka/messages/user-marketing-consent.model';
import { Topics } from '@shared/kafka/topics';

import { handleMessage } from '../handle-message';

import { userMarketingKafkaConsumer } from './kafka';

export const setupConsumer = async (): Promise<void> => {
  console.log('Setting up user marketing consent consumer...');
  await userMarketingKafkaConsumer.connect();
  await userMarketingKafkaConsumer.run<IUserMarketingConsentMessage>({
    topic: Topics.USER_MARKETING_CONSENT,
    eachMessage: async (message) => {
      handleMessage(message);
    },
  });
};
