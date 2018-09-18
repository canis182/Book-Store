const jwt = require('jsonwebtoken');
const { access, refresh, algorithm } = require('../../configs/token');
const User = require('../models/user');

const TYPES = Object.freeze({
  // ACCESS: 'token',
  REFRESH: 'refresh',
});
module.exports = class TokenService {
  static validateTokenType(type) {
    switch (type) {
      // case TYPES.ACCESS:
      case TYPES.REFRESH:
        return;
      default:
        throw new Error('Token is not valid');
    }
  }

  // TODO: check arr
  static validateRefreshToken(token) {
    jwt.verify(token, refresh.secret);
  }

  static getDataFromRefreshToken(token) {
    return jwt.decode(token, refresh.secret);
  }
  // The project uses Passport-auth
  // static validateAccessToken(token) {
  //     let a = jwt.verify(token, access.secret);
  // };

  // The project uses Passport-auth
  // static getDataFromAccessToken(token) {
  // return jwt.decode(token, access.secret);
  // };

  static accessToken(data) {
    const config = {
      payload: {
        tokenType: access.type,
        username: data.name,
        email: data.email,
        userId: data._id,// eslint-disable-line
        role: data.role,
      },
      options: {
        algorithm,
        subject: data._id.toString(),// eslint-disable-line
        expiresIn: access.expiresIn,
      },
    };
    return jwt.sign(config.payload, access.secret, config.options, config.email);
  }

  static refreshToken(data) {
    const config = {
      payload: {
        tokenType: refresh.type,
        email: data.email,
      },
      options: {
        algorithm,
        subject: data._id.toString(),// eslint-disable-line
        expiresIn: refresh.expiresIn,
      },
    };
    return jwt.sign(config.payload, refresh.secret, config.options);
  }

  static async newTokens(token) {
    const decodeToken = await this.getDataFromRefreshToken(token);
    const checkUserInDb = await User.findOne({ _id: decodeToken.sub }, null, { lean: true });

    if (checkUserInDb.length < 1) {
      return {
        error: 'Bye!',
        status: 403,
      };
    }
    const newAccessToken = await this.accessToken(checkUserInDb);
    const newRefreshToken = await this.refreshToken(checkUserInDb);
    return {
      success: {
        newAccessToken, newRefreshToken,
      },
    };
  }
};
