const router = require('express').Router();
const middlewares = require('../../middlewares');

const {
  searchBook,
  readBook,
  addComment,
  addBook,
  changeBook,
} = require('./controller');

router
  .route('/search')
  .get(middlewares.checkUserRole, searchBook);

router
  .route('/read/:id')
  .get(middlewares.checkUserRole, readBook);

router
  .route('/comment/:id')
  .post(middlewares.checkUserRole, addComment);

router
  .route('/add')
  .post(middlewares.checkAdminRole, addBook);

router
  .route('/change/:id')
  .post(middlewares.checkAdminRole, changeBook);

module.exports = router;
