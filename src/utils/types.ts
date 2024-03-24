import { Request } from 'express';

export interface MyRequest extends Request {
  user?: { _id: string };
}
