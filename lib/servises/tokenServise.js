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

    static validateAccessToken(token){
        jwt.verify(token, access.secret);
    }

    static getDataFromAccessToken(token){
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

    // TODO rewrite
    // static updateToken(refrestToken) {
        //     return new Promise(resolve => {
        //         let result = jwt.verify(refrestToken, refresh.secret)
        //         resolve(result);
        //     }).then((result) => {
        //         let userData = User.findOne({ email: result.email }, null, { lean: true })
        //         return userData
        //     }).then((userData) => {
        //         const accessToken = this.accessToken(userData);
        //         const refreshToken = this.refreshToken(userData);
        //         return { accessToken, refreshToken }
        //     }).catch(error => {
        //         if (error.message == "jwt expired") {
        //             return {
        //                 error: `Sorry! Log in again!`,
        //                 status: 401
        //             };
        //         };
        //         return {
        //             error: `Error DB`,
        //             status: 401
        //         };
        //     });
        // };


        // callback
        // const test = jwt.verify(refrestToken, refresh.secret, function (err, decoded) {
        //     if (err) {
        //         return {
        //             error: `Sorry! Log in again!`,
        //             status: 401
        //         };
        //     } else {
        //         return {
        //             decoded
        //         }
        //     };
        // });

        // promise

    //     const test = await new Promise(resolve => {
    //         let result = jwt.verify(refrestToken, refresh.secret);
    //         resolve(result);
    //     }).catch(error => {
    //         return {
    //             error: `Sorry! Log in again!`,
    //             status: 401
    //         };
    //     });
    //     const resultKey = Object.keys(test)
    //     if (resultKey[0] === 'error') {
    //         return test
    //     }
    //     const userData = await User.findOne({ email: test.email }, null, { lean: true })
    //     const accessToken = this.accessToken(userData);
    //     const refreshToken = this.refreshToken(userData);
    //     return { accessToken, refreshToken }
    // };
};