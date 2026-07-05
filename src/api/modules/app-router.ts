import { Router } from 'express';
import { userRouter } from '@api/modules/user/user.router';
import { productRouter } from '@api/modules/product/product.router';
import { eventHandlerRouter } from '@api/modules/event-handler/event-handler.router';

export const appRouter = Router();

appRouter.use('/api/user', userRouter);
appRouter.use('/api/product', productRouter);
appRouter.use('/api/event', eventHandlerRouter);
