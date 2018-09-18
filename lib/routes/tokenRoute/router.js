const router = require('express').Router();
const {
  newTokens,
} = require('./controller');

router
  .route('/refresh')
  .get(newTokens);

module.exports = router;
