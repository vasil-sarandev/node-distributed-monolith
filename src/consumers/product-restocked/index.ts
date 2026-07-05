import { productRestockedKafkaConsumer } from './lib/kafka';
import { setupConsumer } from './lib/setup-consumer';

const startConsumer = async (): Promise<void> => {
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down product restocked consumer...`);
    await productRestockedKafkaConsumer.disconnect();
    process.exit(0);
  };

  // handle shutdown signals - ctrl + c or docker compose down
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  await setupConsumer();
};

startConsumer().catch((error) => {
  console.error('Error starting product restocked consumer:', error);
  process.exit(1);
});
