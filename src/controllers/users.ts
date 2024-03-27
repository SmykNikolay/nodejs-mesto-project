import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { MyRequest } from '../utils/types';
import { STATUS_CODES, ERROR_MESSAGES } from '../utils/errors';
import { DEFAULT_SECRET_KEY } from '../utils/constants';

import User from '../model/user';

export async function getAllUsers(_req : Request, res:Response) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
}

export async function getUserById(req : Request, res:Response) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }
    return res.send(user);
  } catch (err) {
    if ((err as Error).name === 'CastError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({ message: ERROR_MESSAGES.INVALID_USER_ID });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ password: hashedPassword, ...rest });
    await user.save();
    return res.status(STATUS_CODES.CREATED).send(user);
  } catch (err) {
    if ((err as any).code === 11000) {
      return res.status(409).send({ message: ERROR_MESSAGES.EMAIL_EXISTS });
    }
    if ((err as Error).name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.INVALID_USER_DATA });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}

export async function updateUserProfile(req : MyRequest, res:Response) {
  if (req.user === undefined || req.user._id === undefined) {
    return res.status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.USER_NOT_AUTHORIZED });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
    }
    return res.send(user);
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.INVALID_USER_DATA_UPDATE });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}
export async function updateUserAvatar(req : MyRequest, res:Response) {
  if (req.user === undefined || req.user._id === undefined) {
    return res.status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.USER_NOT_AUTHORIZED });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND)
        .send({ message: ERROR_MESSAGES.NOT_FOUND });
    }
    return res
      .send(user);
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.INVALID_AVATAR });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED)
        .send({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(STATUS_CODES.UNAUTHORIZED)
        .send({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
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
      return res.status(STATUS_CODES.UNAUTHORIZED)
        .send({ message: ERROR_MESSAGES.INVALID_TOKEN });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}

export async function getCurrentUser(req: MyRequest, res: Response) {
  if (!req.user) {
    return res.status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.USER_NOT_AUTHORIZED });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
    }
    return res.send(user);
  } catch (err) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}
