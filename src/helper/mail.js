/* eslint-disable no-console */
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

// const transporter = nodemailer.createTransport({
//   port: process.env.GMAIL_PORT,
//   service: 'gmail',
//   host: "smtp.gmail.com",
//   secure: false,
//   auth: {
//     user: process.env.GMAIL_USERNAME,
//     pass: process.env.GMAIL_PASSWORD
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// })

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user:  process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
  }
});

const sendMail = async ({ receiver, subject, text, template }) => {
  try {
    console.log(receiver, subject, text)
    const message = {
      from: process.env.GMAIL_USERNAME, // Sender address
      to: receiver, // List of recipients as array
      subject, // Subject line
      text, // Plain text body
      html: template
    }
  
    const response = await transporter.sendMail(message)
    console.log(response)
  } catch (error) {
    console.log('error-----', error)
  }
}

export default sendMail
