import express from 'express';
import { setupApplication } from '@api/setup-app';
import { PORT } from '@api/env-constants';
import { loggerMiddleware } from '@api/middlewares/logger.middleware';
import { errorMiddleware } from '@api/middlewares/error.middleware';
import { appRouter } from '@api/modules/app-router';

const startServer = async () => {
  await setupApplication();
  const app = express();

  // parse jsons
  app.use(express.json());
  // parse urlencoded bodies
  app.use(express.urlencoded({ extended: true }));
  // parse text bodies
  app.use(express.text());
  // parse raw bodies
  app.use(express.raw());

  app.use(loggerMiddleware);
  app.use(appRouter);
  app.use(errorMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
