import bcrypt from 'bcryptjs';
import { checkMode, generateToken } from '../helper/util';
import UserModel from './models/user';
import { ObjectId } from 'mongodb'
import sendMail from '../helper/mail';


class UserService {
  static async register (req, res){
    try {
      const payload = {
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: await bcrypt.hash(req.body.password, 10),
        isEmailVerified: false,
        isPhoneVerified: false,
      }
  
      const user = await UserModel.create(payload)

      const newUser = user.toObject();

      delete newUser.password;

      const token = generateToken({ email: req.body.payload,
        phoneNumber: req.body.phoneNumber, userId: user._id});

        await sendMail({
          receiver: req.body.email,
          subject: 'Email Verification',
          template: `<p>Click email <a href=${process.env.HOST_URL}/verify-email?userId=${newUser._id}>here<a> to verify your email<p>`})
      return res.status(201).json({ message: 'user was successfully created', data: newUser, token})
      
    } catch (error) {
      return res.status(500).json({ message: 'Something happened', data: error})
    }
  }
  
  static async login (req, res){
    try {
      let userDetails = null;
      const loginUsername = checkMode(req.body.username);

      if(loginUsername === 'unknown'){
        return res.status(400).json({ message: 'wrong username'})
      }

      if(loginUsername === 'email'){
        userDetails = await UserModel.findOne({
          email: req.body.username
        })
      }

      if(loginUsername === 'phone'){
        userDetails = await UserModel.findOne({
          phoneNumber: req.body.username
        })
      }

      if(!userDetails){
        return res.status(404).json({ message: 'user not found, please check credentials'})
      }

      // check if the password is correct
      const isPwdCorrect = await bcrypt.compare(req.body.password, userDetails.password);


      if(!isPwdCorrect){
        return res.status(404).json({ message: 'Incorrect password'})
      }

      const payload = {
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber,
        userId: userDetails._id
      }

      const newUser = userDetails.toObject()

      delete newUser.password;

      const token = generateToken(payload);

      return res.status(200).json({ message: 'user was successfully login', data: newUser, token})
      
    } catch (error) {
      return res.status(500).json({ message: 'Something happened', data: error})
    }
  }

  static async updateUserDetails (req, res){
    try {
      const userExist = await UserModel.findOne({
        _id: ObjectId(req.params.userId)
      });

      if(!userExist){
        return res.status(404).json({ message: 'user not found'})
      }

      const payload = {
        email: req.body.email || userExist.email,
        phoneNumber: req.body.phoneNumber || userExist.phoneNumber,
      }

      await UserModel.findOneAndUpdate({ _id: ObjectId(req.params.userId)}, payload);

      const userDetails = userExist.toObject()

      delete userDetails.password

      return res.status(200).json({ message: 'user details successfully updated', data: userDetails})
      
    } catch (error) {
      return res.status(500).json({ message: 'Something happened', data: error})
    }
  }

  static async getUserDetails(req, res){
    try {
      const userExist = await UserModel.findOne({
        _id: ObjectId(req.user.userId)
      });

      if(!userExist){
        return res.status(404).json({ message: 'user not found'})
      }

      const userDetails = userExist.toObject()

      delete userDetails.password


      return res.status(200).json({ message: 'user details successfully updated', data: userDetails})
    } catch (error) {
      return res.status(500).json({ message: 'Something happened', data: error})
    }
  }

  static async changePassword(req, res) {
    try {
      const userExist = await UserModel.findOne({
        _id: ObjectId(req.user.userId)
      });

      if(!userExist){
        return res.status(404).json({ message: 'user not found'})
      }

      const isPwdCorrect = await bcrypt.compare(req.body.oldPassword, userExist.password);


      if(!isPwdCorrect){
        return res.status(400).json({ message: 'wrong password supplied'})
      }

      const newPassword = await bcrypt.hash(req.body.newPassword, 10);

      await UserModel.findByIdAndUpdate({
        _id: ObjectId(req.user.userId)
      }, {
        ...userExist,
        password: newPassword
      })
      
      return res.status(200).json({ message: 'Password was updated successfully'})
    } catch (error) {
      return res.status(500).json({ message: 'Something happened', data: error})
    }
  }

  static async forgotPassword(req, res) {
    try {
      const userExist = await UserModel.findOne({
        _id: ObjectId(req.params.userId)
      });

      if(!userExist){
        return res.status(404).json({ message: 'user not found'})
      }


      const newPassword = await bcrypt.hash(req.body.newPassword, 10);

      await UserModel.findByIdAndUpdate({
        _id: ObjectId(req.params.userId)
      }, {
        ...userExist.toObject(),
        password: newPassword
      })
      
      return res.status(200).json({ message: 'Updating password was successful'})
    } catch (error) {
      return res.status(500).json({ message: 'Something happened', data: error})
    }
  }

  static async sendVerificationLink(req, res){
    try {
      const userExist = await UserModel.findOne({
        email: req.body.email
      });

      if(!userExist){
        return res.status(404).json({ message: 'user not found'})
      }

      await sendMail({
        receiver: req.body.email,
        subject: 'Email Verification',
        template: `<p>Click email <a href=${process.env.HOST_URL}/forgot-password?userId=${userExist._id}>here<a> to verify your email<p>`})
        return res.status(200).json({ message: 'Verification link was successfully sent'})
    } catch (error) {
      
    }
  }

  static async sendEmailVerificationLink(req, res){
    try {
      const userExist = await UserModel.findOne({
        email: req.body.email
      });

      if(!userExist){
        return res.status(404).json({ message: 'user not found'})
      }

      await sendMail({
          receiver: req.body.email,
          subject: 'Email Verification',
          template: `<p>Click email <a href=${process.env.HOST_URL}/verify-email?userId=${userExist._id}>here<a> to verify your email<p>`})
        return res.status(200).json({ message: 'Email Verification link was successfully sent'})
    } catch (error) {
      
    }
  }

  static async updateEmail(req, res){
    try {
      const userExist = await UserModel.findOne({
        _id: ObjectId(req.user.userId)
      });

      if(!userExist){
        return res.status(404).json({ message: 'user not found'})
      }

      await UserModel.findByIdAndUpdate({
        _id: ObjectId(req.user.userId)
      }, {
        ...userExist.toObject(),
        email: req.body.email
      })

      return res.status(200).json({ message: 'Email was updated successfully'})

    } catch (error) {
      return res.status(500).json({ message: 'Something happened', data: error})
    }
  }

  // static async verifyUser(req, res){
  //   try {
  //     let mode;
  //     const userExist = await UserModel.findOne({
  //       _id: ObjectId(req.params.userId)
  //     });

  //     if(!userExist){
  //       return res.status(404).json({ message: 'user not found'})
  //     }

  //     const loginUsername = checkMode(req.body.username);

  //     if(loginUsername === 'unknown'){
  //       return res.status(400).json({ message: 'wrong username'})
  //     }

  //     if(loginUsername === 'email'){
  //       mode = 'isEmailVerified'
  //     }

  //     if(loginUsername === 'phone'){
  //       mode = 'isPhoneVerified'
  //     }

  //     const userDetails = userExist.toObject()

  //     delete userDetails.password


  //     await UserModel.findByIdAndUpdate({ _id: ObjectId(req.params.userId)}, {
  //       ...userExist,
  //       [mode]: true
  //     })

  //     return res.status(200).json({ message: 'user details successfully updated', data: userDetails})
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Something happened', data: error})
  //   }
  // }

  static async verifyUser(req, res){
    try {

      const userExist = await UserModel.findOne({
        _id: ObjectId(req.params.userId)
      });

      if(!userExist){
        return res.status(404).json({ message: 'user not found'})
      }

      if(!['isPhoneVerified', 'isEmailVerified'].includes(req.body.verifyField)){
        return res.status(400).json({ message: 'wrong username'})
      }

      const userDetails = userExist.toObject()

      const newUserDetail = {
        ...userDetails,
        [req.body.verifyField]: true
      }
      
      delete userDetails.password


      await UserModel.findByIdAndUpdate({ _id: ObjectId(req.params.userId)}, newUserDetail)

      return res.status(200).json({ message: 'user details successfully updated', data: userDetails})
    } catch (error) {
      return res.status(500).json({ message: 'Something happened', data: error})
    }
  }
}

export default UserService