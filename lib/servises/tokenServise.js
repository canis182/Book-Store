const jwt = require('jsonwebtoken');
const { access, refresh, algorithm } = require('../../configs/token');
const User = require('../models/user')

const TYPES = Object.freeze({
    ACCESS: 'token',
    REFRESH: 'refresh'
})
module.exports = class TokenService {
    static validateTokenType(type) {
        switch (type) {
            case TYPES.ACCESS:
            case TYPES.REFRESH:
                return;
            default:
                throw new Error('Token is not valid')
        }
    }

    static validateAccessToken(token) {
        let a = jwt.verify(token, access.secret);
    }

    static getDataFromAccessToken(token) {
        return jwt.decode(token, access.secret);
    }

    static accessToken(data) {
        let config = {
            payload: {
                tokenType: access.type,
                username: data.name,
                email: data.email,
                userId: data._id,
                role: data.role
            },
            options: {
                algorithm: algorithm,
                subject: data._id.toString(),
                expiresIn: access.expiresIn
            }
        };
        return jwt.sign(config.payload, access.secret, config.options, config.email)
    };

    static refreshToken(data) {
        let config = {
            payload: {
                tokenType: refresh.type,
                email: data.email
            },
            options: {
                algorithm: algorithm,
                subject: data._id.toString(),
                expiresIn: refresh.expiresIn
            }
        };
        return jwt.sign(config.payload, refresh.secret, config.options);
    };
};