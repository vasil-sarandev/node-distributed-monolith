import { NextFunction, Request, Response } from 'express';
import { eventHandlerService } from './event-handler.service';
import { IEventDTO } from './event.model';

class EventHandlerController {
  constructor() {}

  handleEvent = async (req: Request<{}, {}, IEventDTO>, res: Response<{ message: string }>, next: NextFunction) => {
    try {
      const event = req.body;
      await eventHandlerService.handleEvent({ ...event, timestamp: event.timestamp ?? new Date().toISOString() });
      res.status(200).json({ message: 'Event handled' });
    } catch (err) {
      next(err);
    }
  };
}

export const eventHandlerController = new EventHandlerController();
