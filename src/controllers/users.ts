import { Request, Response } from 'express';
import { MyRequest } from '../utils/types';
import User from '../model/user';
import { STATUS_CODES, ERROR_MESSAGES } from '../utils/errors';

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
export async function createUser(req : Request, res:Response) {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(STATUS_CODES.CREATED).send(user);
  } catch (err) {
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
    const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
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
      { new: true },
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
