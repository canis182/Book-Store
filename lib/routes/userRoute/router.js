const router = require('express').Router();

const {
    registrationUser,
    authorization,
    refresh
} = require('./controller');

router
    .route('/registration')
    .post(registrationUser);
router
    .route('/authorization')
    .post(authorization);

module.exports = router;
