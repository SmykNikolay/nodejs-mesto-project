import express from 'express';
import * as userController from '../controllers/users';
import { MyRequest } from '../utils/types';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const user = await userController.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.send(user);
  } catch (err) {
    if ((err as Error).name === 'CastError') {
      return res.status(400).send({ message: 'Invalid user id' });
    }
    return res.status(500).send({ message: 'Server error' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const user = await userController.createUser(req.body);
    return res.status(201).send(user);
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      return res.status(400).send({ message: 'Invalid user data' });
    }
    return res.status(500).send({ message: 'Server error' });
  }
});

router.patch('/users/me', async (req: MyRequest, res) => {
  if (req.user === undefined || req.user._id === undefined) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  try {
    const user = await userController.updateUserProfile(req.user._id, req.body);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.send(user);
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      return res.status(400).send({ message: 'Invalid user data' });
    }
    return res.status(500).send({ message: 'Server error' });
  }
});

router.patch('/users/me/avatar', async (req: MyRequest, res) => {
  if (req.user === undefined || req.user._id === undefined) {
    return res.status(401).send({ message: 'User not authorized' });
  }
  try {
    const user = await userController.updateUserAvatar(req.user._id, req.body.avatar);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.send(user);
  } catch (err) {
    if ((err as Error).name === 'ValidationError') {
      return res.status(400).send({ message: 'Invalid avatar url' });
    }
    return res.status(500).send({ message: 'Server error' });
  }
});

export default router;
