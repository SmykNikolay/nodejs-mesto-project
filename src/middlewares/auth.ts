import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

interface MyRequest extends Request {
  user?: Record<string, unknown>;
}

export default (req: MyRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    if (typeof payload === 'object') {
      req.user = payload;
    } else {
      throw new Error();
    }
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  return next();
};
