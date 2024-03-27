import express from 'express';
import * as userController from '../controllers/users';
import auth from '../middlewares/auth';

const router = express.Router();

router.post('/signin', userController.login);

router.post('/signup', userController.createUser);

router.use(auth);

router.get('/users', userController.getAllUsers);

router.get('/users/:userId', userController.getUserById);

router.patch('/users/me', userController.updateUserProfile);

router.patch('/users/me/avatar', userController.updateUserAvatar);

export default router;
