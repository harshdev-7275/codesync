import express from 'express';
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUser,
  getAllStudent,
  editStudent,
  deleteStudent,
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

router
  .route('/students/:id')
  .put(authenticate, authorizeAdmin, editStudent)
  .delete(authenticate, authorizeAdmin, deleteStudent);
router.post('/auth', loginUser);
router.post('/logout', logoutCurrentUser);
export default router;
