import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { ERROR_MESSAGES, UnauthorizedError } from '../utils/errors';
import { DEFAULT_SECRET_KEY } from '../utils/constants';

interface MyRequest extends Request {
  user?: Record<string, unknown>;
}

export default (req: MyRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(ERROR_MESSAGES.INVALID_AUTHORIZATION));
    return;
  }
  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, DEFAULT_SECRET_KEY);
    if (typeof payload === 'object') {
      req.user = payload;
    } else {
      throw new Error();
    }
  } catch (err) {
    next(new UnauthorizedError(ERROR_MESSAGES.INVALID_AUTHORIZATION));
    return;
  }
  next();
};
