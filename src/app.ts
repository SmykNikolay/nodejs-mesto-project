/* eslint-disable no-console */
import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import {
  DEFAULT_MONGO_DB_NAME, DEFAULT_MONGO_DB_PATH, DEFAULT_PORT, DEFAULT_USER_ID,
} from './utils/constants';
import userRoutes from './routes/userRoutes';
import cardRoutes from './routes/cardRoutes';
import { MyRequest } from './utils/types';
import { ERROR_MESSAGES, STATUS_CODES } from './utils/errors';

const app = express();

mongoose.set('strictQuery', true);

const db = `${DEFAULT_MONGO_DB_PATH}/${DEFAULT_MONGO_DB_NAME}`;

app.use(helmet());

mongoose.connect(db)
  .then(() => console.log('Подключение к MongoDB успешно установлено'))
  .catch((error) => console.error('Ошибка подключения к MongoDB:', error));

app.use(express.json());

app.use((req: MyRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: DEFAULT_USER_ID,
  };
  next();
});

app.use(userRoutes);

app.use(cardRoutes);

app.use('*', (req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});

app.use((err: any, req: Request, res: Response) => {
  res
    .status(err.status || STATUS_CODES.INTERNAL_SERVER_ERROR)
    .send({
      message: err.message,
    });
});

app.listen(DEFAULT_PORT, () => {
  console.log(`Сервер запущен на порту ${DEFAULT_PORT}`);
});
