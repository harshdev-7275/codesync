import express from 'express';
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUser,
  getAllStudent,
} from '../controllers/userController.js';
import {
  authorizeAdmin,
  authorizeTeacher,
  authenticate,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(authenticate, authorizeAdmin, createUser)
  .get(authenticate, authorizeAdmin, getAllUser);
router.route('/students').get(authenticate, authorizeAdmin, getAllStudent);
router.post('/auth', loginUser);
router.post('/logout', logoutCurrentUser);
export default router;
