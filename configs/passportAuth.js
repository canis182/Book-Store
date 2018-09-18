const ExtractJwt = require('passport-jwt').ExtractJwt;
const { access } = require('./token');

module.exports = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('token'),
  secretOrKey: access.secret,
};
