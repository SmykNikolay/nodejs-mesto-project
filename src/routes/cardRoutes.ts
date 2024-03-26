import express from 'express';
import * as cardController from '../controllers/cards';

const router = express.Router();

router.get('/cards', cardController.getAllCards);

router.post('/cards', cardController.createCard);

router.get('/cards/:cardId', cardController.getCard);

router.delete('/cards/:cardId', cardController.deleteCard);

router.put('/cards/:cardId/likes', cardController.likeCard);

router.delete('/cards/:cardId/likes', cardController.dislikeCard);

export default router;
