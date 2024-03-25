import express from 'express';
import * as cardController from '../controllers/cards';
import { MyRequest } from '../utils/types';

const router = express.Router();

router.get('/cards', async (req, res) => {
  try {
    const cards = await cardController.getAllCards();
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});

router.post('/cards', async (req, res) => {
  try {
    const card = await cardController.createCard(req.body);
    res.status(201).send(card);
  } catch (err) {
    res.status(400).send({ message: 'Invalid data' });
  }
});

router.delete('/cards/:cardId', async (req, res) => {
  try {
    const card = await cardController.deleteCard(req.params.cardId);
    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }
    return res.send(card);
  } catch (err) {
    return res.status(400).send({ message: 'Invalid id' });
  }
});

router.put('/cards/:cardId/likes', async (req: MyRequest, res) => {
  try {
    if (req.user === undefined || req.user._id === undefined) {
      return res.status(401).send({ message: 'User not authorized' });
    }
    const card = await cardController.likeCard(req.params.cardId, req.user._id);
    return res.send(card);
  } catch (err) {
    return res.status(400).send({ message: 'Invalid id' });
  }
});

router.delete('/cards/:cardId/likes', async (req: MyRequest, res) => {
  try {
    if (req.user === undefined || req.user._id === undefined) {
      return res.status(401).send({ message: 'User not authorized' });
    }
    const card = await cardController.dislikeCard(req.params.cardId, req.user._id);
    return res.send(card);
  } catch (err) {
    return res.status(400).send({ message: 'Invalid id' });
  }
});

export default router;
