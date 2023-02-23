import { body, param, check } from 'express-validator';

const validateUser = {
  register: [
    body('email')
    .trim()
    .isEmail()
    .withMessage('Supply a valid email address'),
    body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Please supply a valid phone number')
    .isString()
    .withMessage('Please supply a valid phone number'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Please supply a valid password')
    .isString()
    .withMessage('Please supply a valid password')
  ],
  login: [
    body('username')
    .trim()
    .notEmpty()
    .withMessage('Please provide a valid username'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Please supply a valid password')
    .isString()
    .withMessage('Please supply a valid password')
  ],
  emailVerification: [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Supply a valid email')
  ],
  verifyUser: [
    check('userId')
    .trim()
    .notEmpty()
    .withMessage('Please provide a valid userId'),
    body('verifyField')
    .trim()
    .notEmpty()
    .withMessage('Please provide a valid phone number or email'),
  ],
  changePassword: [
    check('newPassword')
    .trim()
    .notEmpty()
    .withMessage('Please provide a new password'),
    body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('Please provide old password'),
  ],
  updateEmail: [
    body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  ],
}

export default validateUser