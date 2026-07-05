import { describe, expect, it, vi } from 'vitest';

import { AppError, errorMiddleware } from '../middlewares/error.middleware';
import type { NextFunction, Request, Response } from 'express';

const createMockResponse = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };

  res.status.mockReturnValue(res);

  return res as unknown as Response;
};

describe('AppError', () => {
  it('uses default status and message', () => {
    const error = new AppError();

    expect(error.status).toBe(500);
    expect(error.message).toBe('An unexpected error has ocurred.');
  });

  it('uses provided status and message', () => {
    const error = new AppError(404, 'Not found');

    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
  });
});

describe('errorMiddleware', () => {
  it('returns app error status and message', () => {
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    errorMiddleware(new AppError(404, 'user not found'), {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'user not found' });
  });

  it('returns 500 for unexpected errors', () => {
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorMiddleware(new Error('boom') as AppError, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(Error) });

    consoleError.mockRestore();
  });
});
