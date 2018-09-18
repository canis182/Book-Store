const router = require('express').Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const auth = require('../../middlewares/authenticate');

const {
  registrationUser,
  authorization,
  uploadImg,
} = require('./controller');

router
  .route('/registration')
  .post(registrationUser);
router
  .route('/authorization')
  .post(authorization);
router
  .route('/single')
// .post(middlewares.authUser, upload.single('img'), uploadImg);
  .post(auth().authenticate(), upload.single('img'), uploadImg);

module.exports = router;
