import { KafkaProducer } from '@shared/kafka/producer';
import { KAFKA_BROKERS, KAFKA_CLIENT_ID } from '@api/env-constants';

export const apiKafkaProducer = new KafkaProducer({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
});
