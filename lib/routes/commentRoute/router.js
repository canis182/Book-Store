const router = require('express').Router()

const {
    searchBookForName,
    delateAllComments,
    deleteCommentById
} = require('./controller')

router
    .route('/searchuser')
    .get(searchBookForName)
    .delete(delateAllComments);
router
    .route('/searchid')
    .delete(deleteCommentById)


module.exports = router;