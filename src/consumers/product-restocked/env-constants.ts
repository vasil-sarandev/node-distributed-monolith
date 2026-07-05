export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID as string;
export const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID as string;
export const KAFKA_BROKERS = (process.env.KAFKA_BROKERS ?? '')
  .split(',')
  .map((broker) => broker.trim())
  .filter(Boolean);
