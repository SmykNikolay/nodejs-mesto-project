import { Request } from 'express';

export interface MyRequest extends Request {
  user?: { _id: string };
}

export interface IError extends Error {
  status?: number;
}
