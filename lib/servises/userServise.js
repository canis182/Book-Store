const Joi = require('joi');
const crypto = require('crypto');
const { join } = require('path');
const Users = require('../models/user');
const Img = require('../models/img');
const schema = require('../validateSchemas/schemas');
const configHash = require('../../configs/hash');
const token = require('../servises/tokenServise');

module.exports = class User {
  static async registrationUser(data) {
    try {
      const newUserData = {
        name: data.name.replace(/^\w/, e => e.toUpperCase()),
        surname: data.surname.replace(/^\w/, e => e.toUpperCase()),
        nickname: data.nickname,
        age: data.age,
        password: data.password,
        email: data.email,
        role: 'User',
      };

      if (newUserData.nickname.length < 1) {
        newUserData.nickname = newUserData.name;
      }

      const {
        name, surname, nickname, age, email, role,
      } = await Joi.validate(newUserData, schema.validateSchemaForRegistration);
      // Check the existence of registration
      const resultSearchEmail = await Users.findOne({ email });

      if (resultSearchEmail) {
        return {
          error: `Sorry! But user under this email: ${email} exist!!`,
          status: 403,
        };
      }
      // Check the existence of a nickname
      const resultSearchNickname = await Users.findOne({ nickname });

      if (resultSearchNickname) {
        return {
          error: `Sorry! But user under this nickname: ${nickname} exist!`,
          status: 403,
        };
      }
      const hash = crypto.createHash(configHash.algorithm);
      hash.setEncoding('hex');
      // the text that you want to hash
      hash.write(data.password);
      hash.end();
      // resulting hash
      const passHash = hash.read();
      // Create new user in DB
      await new Users({
        name, surname, nickname, age, password: passHash, email, role,
      }).save();
      const searchUser = await Users.findOne({ nickname }, null, { lean: true });
      const accessToken = token.accessToken(searchUser);
      const refreshToken = token.refreshToken(searchUser);
      return ({
        success: `Hey! Your profile was created! Your nickname: ${newUserData.nickname}.`,
        aToken: accessToken,
        rToken: refreshToken,
      });
    } catch (err) {
      return {
        error: err.message,
        status: 500,
      };
    }
  }

  static async authorization(data) {
    try {
      await Joi.validate(data, schema.validateSchemaForAuthorization);
      const searchUser = await Users.findOne({ nickname: data.nickname }, null, { lean: true });

      if (!searchUser) {
        return {
          error: `Sorry! User with Nickname: ${data.nickname} is not defined!`,
          status: 404,
        };
      }

      const hash = crypto.createHash(configHash.algorithm);
      hash.setEncoding('hex');
      // the text that you want to hash
      hash.write(data.password);
      hash.end();
      // resulting hash
      const passwordHash = hash.read();

      if (searchUser.password !== passwordHash) {
        return {
          error: 'Sorry! Your password is incorrect!',
          status: 403,
        };
      }

      const accessToken = token.accessToken(searchUser);
      const refreshToken = token.refreshToken(searchUser);
      return {
        success: `Welcome ${searchUser.name}!.`,
        aToken: accessToken,
        rToken: refreshToken,
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500,
      };
    }
  }

  static async uploadImg(data) {
    try {
      if (!data.img) {
        return {
          error: 'No files were uploaded.',
          status: 400,
        };
      }

      // <input name="img" type="file" />
      const someImg = data.img;
      const searchImg = await Img.find({ name: data.user.userId });

      if (searchImg) {
        await Img.remove({ name: data.user.userId });
      }

      const expansion = someImg.mimetype.search(/(png|jpeg|gif|webp)/gi);
      await new Img({
        name: data.user.userId,
        path: join('lib', 'img', `${data.user.userId}.${expansion}`),
        idUser: data.user.userId,
      }).save();
      await someImg.mv(join('lib', 'img', `${data.user.userId}.${expansion}`));
      return {
        success: 'New Img Add!',
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500,
      };
    }
  }
};
