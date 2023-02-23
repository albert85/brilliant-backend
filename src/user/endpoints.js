import express from 'express';
import { validate } from '../helper/util';
import AuthCheck from './middleware/auth';
import UserService from './service';
import validateUser from './validator';

const router = express.Router();

router.get('/', AuthCheck.checkAuthStatus, UserService.getUserDetails)
router.post('/register', validateUser.register, validate, UserService.register);
router.post('/login', validateUser.login, validate, UserService.login)
router.put('/change-password', AuthCheck.checkAuthStatus, validateUser.changePassword, validate, UserService.changePassword)
router.put('/email-update', AuthCheck.checkAuthStatus, validateUser.updateEmail, validate, UserService.updateEmail)
router.put('/:userId', UserService.updateUserDetails)
router.post('/verify/:userId', validateUser.verifyUser, validate, UserService.verifyUser)
router.put('/forgot-password/:userId', UserService.forgotPassword)
router.post('/email-verification', validateUser.emailVerification, validate, UserService.sendVerificationLink)
router.post('/send-email-verification', validateUser.emailVerification, validate, UserService.sendEmailVerificationLink)


export default router;