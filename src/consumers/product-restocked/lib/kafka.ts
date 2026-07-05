import { KafkaConsumer } from '@shared/kafka/consumer';

import { KAFKA_BROKERS, KAFKA_CLIENT_ID, KAFKA_GROUP_ID } from '../env-constants';

export const productRestockedKafkaConsumer = new KafkaConsumer({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
  groupId: KAFKA_GROUP_ID,
});
