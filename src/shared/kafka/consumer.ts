import { Consumer, Kafka } from 'kafkajs';
import { Topics } from '@shared/kafka/topics';

export type KafkaConsumerConfig = {
  clientId: string;
  brokers: string[];
  groupId: string;
};

export type KafkaMessageHandler<T> = (message: T) => Promise<void>;

export class KafkaConsumer {
  private consumer: Consumer;

  constructor({ clientId, brokers, groupId }: KafkaConsumerConfig) {
    const kafka = new Kafka({ clientId, brokers });
    this.consumer = kafka.consumer({ groupId });
  }

  connect = async (): Promise<void> => {
    await this.consumer.connect();
  };

  disconnect = async (): Promise<void> => {
    await this.consumer.disconnect();
  };

  run = async <T>({ topic, eachMessage }: { topic: Topics; eachMessage: KafkaMessageHandler<T> }): Promise<void> => {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value === null) {
          return;
        }

        const parsed = JSON.parse(message.value.toString()) as T;
        await eachMessage(parsed);
      },
    });
  };
}
