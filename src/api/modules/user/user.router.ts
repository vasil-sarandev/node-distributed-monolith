import { Router } from 'express';
import { userController } from './user.controller';

export const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.post('/:id/marketing-consent', userController.updateUserMarketingConsent);
