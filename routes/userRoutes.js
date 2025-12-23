import express from 'express';
import { getCurrentUser, getUsers } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get Current User
router.get('/current', authMiddleware, getCurrentUser);

// Get All Users
router.post('/list', authMiddleware, getUsers);

export default router;

