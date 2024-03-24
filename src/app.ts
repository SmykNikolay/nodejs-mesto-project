/* eslint-disable no-console */
import mongoose from 'mongoose';
import express, { Request, Response, NextFunction } from 'express';
import {
  DEFAULT_MONGO_DB_NAME, DEFAULT_MONGO_DB_PATH, DEFAULT_PORT, DEFAULT_USER_ID,
} from './utils/constants';
import UserRoute from './controllers/users';
import { MyRequest } from './utils/types';
import { STATUS_CODES } from './utils/errors';

const app = express();

mongoose.set('strictQuery', true);

const db = `${DEFAULT_MONGO_DB_PATH}/${DEFAULT_MONGO_DB_NAME}`;

mongoose.connect(db)
  .then(() => console.log('Подключение к MongoDB успешно установлено'))
  .catch((error) => console.error('Ошибка подключения к MongoDB:', error));

app.use((req: MyRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: DEFAULT_USER_ID,
  };
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Привет, мир!');
});

app.use(UserRoute);

app.get('/about', (req: Request, res: Response) => {
  res.send('О нас');
});

app.get('/contact', (req: Request, res: Response) => {
  res.send('Контакты');
});

app.use((err: any, req: Request, res: Response) => {
  res.status(err.status || STATUS_CODES.INTERNAL_SERVER_ERROR);
  res.send({
    message: err.message,
  });
});

app.listen(DEFAULT_PORT, () => {
  console.log(`Сервер запущен на порту ${DEFAULT_PORT}`);
});
