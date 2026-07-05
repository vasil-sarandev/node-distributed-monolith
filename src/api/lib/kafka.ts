import { KafkaProducer } from '../../shared/kafka/producer';
import { KAFKA_BROKERS, KAFKA_CLIENT_ID } from '../env-constants';

export const kafkaProducer = new KafkaProducer({
  clientId: KAFKA_CLIENT_ID,
  brokers: KAFKA_BROKERS,
});
