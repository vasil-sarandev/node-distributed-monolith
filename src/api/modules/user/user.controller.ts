import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import { IUser } from './user.model';
import { AppError } from '@api/middlewares/error.middleware';

class UserController {
  constructor() {}

  getAllUsers = async (req: Request, res: Response<IUser[]>, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request<{ id: string }>, res: Response<IUser>, next: NextFunction) => {
    try {
      const user = await userService.getUserById(parseInt(req.params.id));
      if (user) {
        return res.status(200).json(user);
      }
      throw new AppError(404, 'user not found');
    } catch (error) {
      next(error);
    }
  };

  updateUserMarketingConsent = async (
    req: Request<{ id: string }, {}, { accepts_marketing: boolean }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await userService.getUserById(parseInt(req.params.id));
      if (!user) {
        throw new AppError(404, 'user not found');
      }
      await userService.updateUserMarketingConsent({ user, accepts_marketing: req.body.accepts_marketing });
      return res.status(200).json({ message: 'User marketing consent change has been sent for processing' });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
