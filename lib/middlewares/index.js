const TokenServise = require('../servises/tokenServise');

module.exports = class Middleware {
  /* function authUser - alternative to authentication passport */
  // static async authUser(req, res, next) {
  //     const { authentication: tokenData } = req.headers;
  //     const [tokenType, token] = tokenData.split(' ');

  //     try {
  //         TokenServise.validateTokenType(tokenType);
  //         TokenServise.validateAccessToken(token);
  //         const user = TokenServise.getDataFromAccessToken(token);
  //         req.user = user;
  //         next();
  //     } catch (error) {
  //         return res.json({
  //             error: error.message,
  //             status: 500
  //         });
  //     };
  // };

  static async checkValidateRefreshToken(req, res, next) {
    try {
      const tokenData = req.headers.authorization;
      const [tokenType, token] = tokenData.split(' ');
      await TokenServise.validateTokenType(tokenType);
      await TokenServise.validateRefreshToken(token);
      req.userRefreshToken = token;
      return next();
    } catch (error) {
      return res.json({
        error: error.message,
        status: 500,
      });
    }
  }


  static async checkUserRole(req, res, next) {
    const { user } = req;

    if (user[0].role !== 'User' && user[0].role !== 'Admin') {
      return res.json({
        error: 'You do not have the rights',
        status: 403,
      });
    }
    return next();
  }

  static async checkAdminRole(req, res, next) {
    const { user } = req;

    if (user[0].role !== 'Admin') {
      return res.json({
        error: 'You do not have the rights',
        status: 403,
      });
    }
    return next();
  }
};
