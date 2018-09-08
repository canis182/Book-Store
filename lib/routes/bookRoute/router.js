const router = require('express').Router();
const middleware = require('../../middlewares');

const {
    searchBook,
    readBook,
    addComment,
    addBook,
    changeBook
} = require('./controller');

router
    .route('/search')
    .get(middleware.checkUserRole, searchBook);

router
    .route('/read/:id')
    .get(middleware.checkUserRole, readBook);

router
    .route('/comment/:id')
    .post(middleware.checkUserRole, addComment);

router
    .route('/add')
    .post(middleware.checkAdminRole, addBook);

router
    .route('/change/:id')
    .post(middleware.checkAdminRole, changeBook);

module.exports = router;
