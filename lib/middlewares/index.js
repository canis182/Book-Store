const TokenServise = require('../servises/tokenServise');
const jwt = require('jsonwebtoken');
const { access, refresh, algorithm } = require('../../configs/token');


module.exports = class Middleware {
    static async authUser(req, res, next) {
        const { authentication: tokenData } = req.headers;
        const [tokenType, token] = tokenData.split(' ');

        try {
            TokenService.validateTokenType(tokenType);
            TokenServise.validateAccessToken(token);

            const user = TokenServise.getDataFromAccessToken(token);
            req.user = user;

            next();
        } catch (error) {
            return res.json({
                error: error.message,
                status: 401
            });
        };
    };

    static async checkUserRole(req, res, next) {
        const { user } = req;

        if (user.role !== 'User' && user.role !== 'Admin') {
            return res.json({
                error: 'You do not have the rights',
                status: 403
            });
        };
        next()
    };

    static async checkAdminRole(req, res, next) {
        const { user } = req;

        if (user.role !== 'Admin') {
            return res.json({
                error: 'You do not have the rights',
                status: 403
            });
        };
        next();
    };
};