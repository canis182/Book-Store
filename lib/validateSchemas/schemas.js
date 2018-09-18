const Joi = require('joi');

exports.validateSchemaForReadAReadRequest = Joi.string().regex(/^[A-Z0-9]/i).min(5).max(30)
  .required();
exports.validateSchemaForComment = Joi.string().min(4).max(50).required();
exports.validateSchemaForName = Joi.string().regex(/\D/).min(3).max(10)
  .required();
exports.validateSchemaForId = Joi.string().min(10).max(25).required();
exports.validateSchemaForToken = Joi.string().token();
exports.validateSchemaForNewBook = {
  name: Joi.string().regex(/^[A-Z0-9]/i).min(1).max(30)
    .required(),
  author: Joi.string().regex(/^[A-Z]/i).min(2).max(20)
    .required(),
  description: Joi.string().regex(/^[A-Z]/i).min(3).max(100)
    .required(),
  text: Joi.string().min(10).required(),
  comments: Joi.string(),
};
exports.validateSchemaForChange = {
  name: Joi.string().regex(/^[A-Z0-9]/i).min(1).max(30),
  author: Joi.string().regex(/^[A-Z]/i).min(1).max(20),
  description: Joi.string().regex(/^[A-Z]/i).min(3).max(100),
  text: Joi.string().min(10),
  comments: Joi.string(),
};
exports.validateSchemaForRegistration = {
  name: Joi.string().regex(/\D/).min(3).max(10)
    .required(),
  surname: Joi.string().regex(/\D/).min(3).max(10),
  nickname: Joi.string().alphanum(),
  age: Joi.number().min(10).max(60),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  email: Joi.string().email().required(),
  role: Joi.string().regex(/\D/).min(3).max(10)
    .required(),
};
exports.validateSchemaForAuthorization = {
  nickname: Joi.string().regex(/^[A-Z0-9]/i).min(1).max(20)
    .required(),
  password: Joi.string().strip().required(),
  userRole: Joi.string().required(),
};
