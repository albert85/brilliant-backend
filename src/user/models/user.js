import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  phoneNumber: String,
  interests: String,
  password: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const UserModel = model('user', userSchema)

export default UserModel
