import express from 'express';
const router = express.Router();
import {login, signup, me,} from '../controller/userController'
import { protect } from '../utils/middleware';
import {sendVerificationMail, verifyEmail} from "../middleware/VerifyEmail";

router.post('/login', login);
router.post('/signup', signup);
router.get('/me',protect, me);
router.get('/verifyEmail/',verifyEmail)

export default router;
