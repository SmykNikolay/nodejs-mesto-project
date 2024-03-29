import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  STATUS_CODES,
  ERROR_MESSAGES,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  ConflictError,
} from '../utils/errors';

import { MyRequest } from '../utils/types';

import { DEFAULT_SECRET_KEY } from '../utils/constants';

import User from '../model/user';

export async function getAllUsers(_req : Request, res:Response, next: NextFunction) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
  }
}

export async function getUserById(req : Request, res:Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
      return;
    }
    res.send(user);
  } catch (err) {
    if ((err as Error).name === 'CastError') {
      next(new BadRequestError(ERROR_MESSAGES.INVALID_USER_ID));
    }
    next(new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ password: hashedPassword, ...rest });
    await user.save();
    return res.status(STATUS_CODES.CREATED).send(user);
  } catch (err) {
    if ((err as any).code === 11000) {
      return next(new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS));
    } if ((err as Error).name === 'ValidationError') {
      return next(new BadRequestError(ERROR_MESSAGES.INVALID_USER_DATA));
    }
    return next(new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
  }
}

export async function updateUserProfile(req: MyRequest, res: Response, next: NextFunction) {
  if (req.user === undefined || req.user._id === undefined) {
    next(new UnauthorizedError(ERROR_MESSAGES.USER_NOT_AUTHORIZED));
    return;
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      return;
    }
    res.send(user);
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      next(new BadRequestError(ERROR_MESSAGES.INVALID_USER_DATA_UPDATE));
    } else {
      next(new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }
}

export async function updateUserAvatar(req: MyRequest, res: Response, next: NextFunction) {
  if (req.user === undefined || req.user._id === undefined) {
    next(new UnauthorizedError(ERROR_MESSAGES.USER_NOT_AUTHORIZED));
    return;
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError(ERROR_MESSAGES.NOT_FOUND));
      return;
    }
    res.send(user);
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      next(new BadRequestError(ERROR_MESSAGES.INVALID_AVATAR));
    } else {
      next(new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
    }
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    const token = jwt.sign({ _id: user._id }, DEFAULT_SECRET_KEY, { expiresIn: '7d' });
    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.send({ token });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN));
    }
    return next(new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
  }
}

export async function getCurrentUser(req: MyRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    next(new UnauthorizedError(ERROR_MESSAGES.USER_NOT_AUTHORIZED));
    return;
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
      return;
    }
    res.send(user);
  } catch (err) {
    next(new InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR));
  }
}
