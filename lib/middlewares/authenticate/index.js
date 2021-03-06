const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const jwtOptions = require('../../../configs/passportAuth');
const User = require('../../models/user');

module.exports = () => {
  const strategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    const userData = await User.find(
      { _id: payload.userId },
      { password: 0, __v: 0, email: 0 },
      { lean: true },
    );
    return done(null, userData);
  });
  passport.use(strategy);
  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
