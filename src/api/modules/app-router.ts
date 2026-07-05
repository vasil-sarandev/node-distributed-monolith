import { Router } from 'express';
import { eventHandlerRouter } from '@api/modules/event-handler/event-handler.router';
import { productRouter } from '@api/modules/product/product.router';
import { userRouter } from '@api/modules/user/user.router';

export const appRouter = Router();

appRouter.use('/api/user', userRouter);
appRouter.use('/api/product', productRouter);
appRouter.use('/api/event', eventHandlerRouter);
