import {decodeToken, handleResponse} from '../../helper/util'

class AuthCheck {
  static checkAuthStatus(req, res, next) {
    const bearerHeader = req.headers.authorization
    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      req.token = bearerToken
      const user = decodeToken(bearerToken)
      req.user = user
      next()
      return
    }
    return handleResponse(res, 403, 'Unauthorized Action, Please register or login')
  }

  static checkToken(req, res, next) {
    const decodedToken = decodeToken(req.token)

    if (!decodedToken || decodedToken.expiresAt <= Date.now()) {
      return handleResponse(res, 401, 'Token Expired, please re-login')
    }

    next()
  }

}

export default AuthCheck;