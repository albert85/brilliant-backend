import CryptoJS from 'crypto-js'
import { validationResult } from 'express-validator';

export const checkMode = (username) => {
  if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(username)){
    return 'email';
  }

  if(/^[0-9+]{5,}$/i.test(username)){
    return 'phone';
  }

  return 'unknown';
}

export const generateToken = payload => CryptoJS.AES.encrypt(JSON.stringify(payload), process.env.TOKEN_PASSWORD).toString()

export const decodeToken = (token) => {
  const bytes = CryptoJS.AES.decrypt(token, process.env.TOKEN_PASSWORD)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

export const generateOTP = () => Math.floor(1000 + Math.random() * 9000)

export const sendSmsOtp = (otp, phoneNumber) => {
}

export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    message: errors.array()[0].msg,
    errors: extractedErrors
  })
}

export const handleResponse = (res, statusCode, message, data, token) => res.status(statusCode).json({
  message,
  data,
  token
})