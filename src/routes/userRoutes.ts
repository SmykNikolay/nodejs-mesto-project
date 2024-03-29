import express from 'express';
import * as validate from '../middlewares/validation';
import * as userController from '../controllers/users';
import auth from '../middlewares/auth';

const router = express.Router();

router.post('/signin', validate.signInValidation, userController.login);

router.post('/signup', validate.signUpValidation, userController.createUser);

router.use(auth);

router.get('/users', userController.getAllUsers);

router.get('/users/me', userController.getCurrentUser);

router.get('/users/:userId', validate.userIdValidation, userController.getUserById);

router.patch('/users/me/avatar', validate.updateUserAvatarValidation, userController.updateUserAvatar);

router.patch('/users/:userId', validate.updateUserProfileValidation, userController.updateUserProfile);

export default router;
