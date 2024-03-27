import { Request, Response } from 'express';
import { STATUS_CODES, ERROR_MESSAGES } from '../utils/errors';
import Card from '../model/card';
import { MyRequest } from '../utils/types';

export async function getAllCards(_req:Request, res:Response) {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}
export async function createCard(req:Request, res:Response) {
  try {
    const card = await Card.create(req.body);
    return res.status(STATUS_CODES.CREATED).send(card);
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      return res.status(STATUS_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.INVALID_CARD_DATA });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}

export async function getCard(req:Request, res:Response) {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.CARD_NOT_FOUND });
    }
    return res.send(card);
  } catch (err) {
    if ((err as Error).name === 'CastError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({ message: ERROR_MESSAGES.INVALID_ID });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}
export async function deleteCard(req: MyRequest, res: Response) {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.CARD_NOT_FOUND });
    }
    if (req.user === undefined
      || req.user._id === undefined
      || !(card.owner as any).equals(req.user._id)) {
      return res.status(403).send({ message: ERROR_MESSAGES.FORBIDDEN });
    }
    await card.remove();
    return res.send(card);
  } catch (err) {
    if ((err as Error).name === 'CastError') {
      return res.status(STATUS_CODES.BAD_REQUEST).send({ message: ERROR_MESSAGES.INVALID_ID });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}

export async function likeCard(req:MyRequest, res:Response) {
  try {
    if (req.user === undefined || req.user._id === undefined) {
      return res.status(STATUS_CODES.UNAUTHORIZED)
        .send({ message: ERROR_MESSAGES.USER_NOT_AUTHORIZED });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.INVALID_CARD_ID });
    }
    return res.send(card);
  } catch (err) {
    if ((err as Error).name === 'CastError') {
      return res.status(STATUS_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.INVALID_LIKE_DATA });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

export async function dislikeCard(req:MyRequest, res:Response) {
  try {
    if (req.user === undefined || req.user._id === undefined) {
      return res.status(STATUS_CODES.UNAUTHORIZED)
        .send({ message: ERROR_MESSAGES.USER_NOT_AUTHORIZED });
    }
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.INVALID_CARD_ID });
    }
    return res.send(card);
  } catch (err) {
    if ((err as Error).name === 'CastError') {
      return res.status(STATUS_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.INVALID_LIKE_DATA });
    }
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}
