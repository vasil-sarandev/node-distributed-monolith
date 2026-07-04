export type IEvent = {
  topic: string;
  timestamp: string;
  payload: unknown;
};

export type IEventDTO = Omit<IEvent, 'timestamp'> & {
  timestamp?: string;
};
