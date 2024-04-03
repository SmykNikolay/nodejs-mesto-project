import express from 'express';
import * as cardController from '../controllers/cards';
import * as validate from '../middlewares/validation';

const router = express.Router();

router.get('/cards', cardController.getAllCards);

router.post('/cards', validate.createCardValidation, cardController.createCard);

router.get('/cards/:cardId', validate.cardIdValidation, cardController.getCard);

router.delete('/cards/:cardId', validate.cardIdValidation, cardController.deleteCard);

router.put('/cards/:cardId/likes', validate.cardIdValidation, cardController.likeCard);

router.delete('/cards/:cardId/likes', validate.cardIdValidation, cardController.dislikeCard);

export default router;
