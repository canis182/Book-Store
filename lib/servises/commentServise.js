const Joi = require('joi');
const schema = require('../validateSchemas/schemas');
const User = require('../models/user');
const Comments = require('../models/comment')
const Book = require('../models/book')


module.exports = class Comment {
    static async searchComment(name) {
        const correctName = name.replace(/(?<=\s|^)[a-z]/ig, e => e.toUpperCase());
        //search validate name
        const valid = await Joi.validate(correctName, schema.validateSchemaForName);
        //search nickname for name in db
        const resultNickname = await User.findOne({ name: correctName }, { nickname: 1, _id: 0 })

        if (!resultNickname) {
            return {
                error: `User: ${correctName} is not found`,
                status: 404
            }
        }
        const nickname = JSON.parse(JSON.stringify(resultNickname.nickname));
        // search comments for nickname in db
        let resultSearchComments = await Comments.find({ user: nickname }, { __v: 0 })

        if (!resultSearchComments) {
            return {
                error: `User: ${correctName} comments is not found`,
                status: 404
            }
        }
        resultSearchComments.reverse()
        return {
            success: resultSearchComments
        };
    };

    static async delateAllCommentByUserName(name) {
        const correctName = name.replace(/(?<=\s|^)[a-z]/ig, e => e.toUpperCase());
        //search validate name
        const valid = await Joi.validate(correctName, schema.validateSchemaForName);
        //search nickname for name in db
        const resultNickname = await User.findOne({ name: correctName }, { nickname: 1, _id: 0 })

        if (!resultNickname) {
            return {
                error: `User: ${correctName} is not found`,
                status: 404
            };
        };

        const nickname = JSON.parse(JSON.stringify(resultNickname.nickname));
        // search comments for nickname in db
        let resultSearchComments = await Comments.find({ user: nickname }, { book: 1, _id: 0 })

        if (!resultSearchComments) {
            return {
                error: `User: ${correctName} comments is not found`,
                status: 404
            };
        };

        const arrComments = JSON.parse(JSON.stringify(resultSearchComments));

        for (let i = 0; i < arrComments.length; i++) {
            let idBook = arrComments[i]
            for (let key in idBook) {
                const book = await Book.update(
                    { _id: idBook[key] },
                    { $pull: { comments: { user: nickname } } },
                    { multi: true })
                const comm = await Comments.remove({ book: idBook[key], user: nickname })
            };
        };
        return {
            success: `All comments by user: ${correctName} are deleted.`
        }
    };

    static async deleteCommentById(id) {
        const correctId = Joi.validate(id, schema.validateSchemaForId);
        const searchComment = await Comments.findOne({ _id: id }, { user: 1, book: 1, _id: 0 })
        if (!searchComment) {
            return {
                error: `Comment by id: ${id} is not found`,
                status: 404
            };
        };
        const cloneCommentData = JSON.parse(JSON.stringify(searchComment));
        const deleteCommentInBookCollection = await Book.update(
            { _id: cloneCommentData.book },
            { $pull: { comments: { _id: id } } },
            { multi: true })
        const deleteCommentInCommentCollection = await Comments.remove({ _id: id })

        return {
            success: `Comments by id: ${correctId} is deleted.`
        }
    };
};

