const TokenServise = require('../servises/tokenServise');
const jwt = require('jsonwebtoken');
const { access, refresh, algorithm } = require('../../configs/token');
const User = require('../models/user')


module.exports = class Middleware {
    static async authUser(req, res, next) {
        const { authentication: tokenData } = req.headers;
        // const [tokenType, token] = tokenData.split(' ');
        const tokenTypeAndTokenItself = tokenData.split(' ');
        try {
            TokenServise.validateTokenType(tokenTypeAndTokenItself[0]);
            TokenServise.validateAccessToken(tokenTypeAndTokenItself[1]);
            const user = TokenServise.getDataFromAccessToken(tokenTypeAndTokenItself[1]);
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

    static async checkAdminInDb() {
        const searchAdmin = await User.find({ name: 'Admin' });
        if (searchAdmin.length < 1) {
            await new User({
                name: 'Admin',
                nickname: 'Admin',
                password: '887375daec62a9f02d32a63c9e14c7641a9a8a42e4fa8f6590eb928d9744b57bb5057a1d227e4d40ef911ac030590bbce2bfdb78103ff0b79094cee8425601f5',
                role: 'Admin'
            }).save();
        };
    };
};