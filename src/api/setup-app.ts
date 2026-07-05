import { apiKafkaProducer } from '@api/lib/kafka';

const setupServices = async () => {
  console.log('Setting up app services...');
  await Promise.all([apiKafkaProducer.connect()]);
  console.log('Services setup complete');
};

export const setupApplication = async () => {
  try {
    await setupServices();
    // add more setup steps here if you need to
  } catch (error) {
    console.error('Error setting up app:', error);
    throw error;
  }
};
