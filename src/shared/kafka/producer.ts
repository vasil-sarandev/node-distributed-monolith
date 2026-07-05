import { Kafka, Producer } from 'kafkajs';
import { Topics } from './topics';

export type KafkaProducerConfig = {
  clientId: string;
  brokers: string[];
};

export class KafkaProducer {
  private producer: Producer;

  constructor({ clientId, brokers }: KafkaProducerConfig) {
    this.producer = new Kafka({ clientId, brokers }).producer();
  }

  connect = async (): Promise<void> => {
    await this.producer.connect();
  };

  disconnect = async (): Promise<void> => {
    await this.producer.disconnect();
  };

  send = async <T>({ topic, message, key }: { topic: Topics; message: T; key?: string }) => {
    return this.producer.send({
      topic,
      messages: [
        {
          ...(key !== undefined ? { key } : {}),
          value: JSON.stringify(message),
        },
      ],
    });
  };
}
