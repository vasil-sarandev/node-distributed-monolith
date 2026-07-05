export const PORT = process.env.PORT as string;
export const NODE_ENV = process.env.NODE_ENV as string;

export const KAFKA_CLIENT_ID = 'node-distributed-monolith-api';
export const KAFKA_BROKERS = (process.env.KAFKA_BROKERS ?? '')
  .split(',')
  .map((broker) => broker.trim())
  .filter(Boolean);
