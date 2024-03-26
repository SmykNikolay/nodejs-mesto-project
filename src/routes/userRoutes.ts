import express from 'express';
import * as userController from '../controllers/users';

const router = express.Router();

router.get('/users', userController.getAllUsers);

router.get('/users/:userId', userController.getUserById);

router.post('/users', userController.createUser);

router.patch('/users/me', userController.updateUserProfile);

router.patch('/users/me/avatar', userController.updateUserAvatar);

export default router;
