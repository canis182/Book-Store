const Joi = require('joi');
const schema = require('../validateSchemas/schemas');
const User = require('../models/user');
const Comments = require('../models/comment')
const Book = require('../models/book')


module.exports = class Comment {

    static async searchComment(name) {
        try {
            //search validate name
            const valid = await Joi.validate(name, schema.validateSchemaForName);
            const correctDataSearch = new RegExp('(' + name + ')', 'i');
            //search nickname for name in db
            const userNickname = await User.findOne({ name: correctDataSearch }, { nickname: 1, _id: 0 }, { lean: true })

            if (!userNickname) {
                return {
                    error: `User: ${name} is not found`,
                    status: 404
                };
            };

            // search comments for nickname in db
            let resultSearchComments = await Comments.find({ user: userNickname.nickname }, { __v: 0 })

            if (!resultSearchComments) {
                return {
                    error: `User: ${name} comments is not found`,
                    status: 404
                };
            };
            return {
                success: resultSearchComments
            };
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        }
    };

    static async delateAllCommentByUserName(name) {
        try {
            //search validate name
            await Joi.validate(name, schema.validateSchemaForName);
            const correctDataSearch = new RegExp('(' + name + ')', 'i');
            //search nickname for name in db
            const userNickname = await User.findOne({ name: correctDataSearch }, { nickname: 1, _id: 0 }, { lean: true })

            if (!userNickname) {
                return {
                    error: `User: ${name} is not found`,
                    status: 404
                };
            };

            // search comments for nickname in db
            let allUserComments = await Comments.find({ user: userNickname.nickname }, { book: 1, _id: 0 }, { lean: true })

            if (!allUserComments) {
                return {
                    error: `User: ${name} comments is not found`,
                    status: 404
                };

            };

            for (let i = 0; i < allUserComments.length; i++) {
                let idBook = allUserComments[i]
                for (let key in idBook) {
                    await Book.update(
                        { _id: idBook[key] },
                        { $pull: { comments: { user: userNickname.nickname } } },
                        { multi: true })
                    await Comments.remove({ book: idBook[key], user: userNickname.nickname })
                };
            };
            return {
                success: `All comments by user: ${name} are deleted.`
            };
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        };
    };

    static async deleteCommentById(id) {
        try {
            await Joi.validate(id, schema.validateSchemaForId);
            const comment = await Comments.findOne({ _id: id }, { book: 1, _id: 0 });
            if (!comment) {
                return {
                    error: `Comment by id: ${id} is not found`,
                    status: 404
                };
            };
            await Book.update({ _id: comment.book }, { $pull: { comments: { _id: id } } }, { multi: true })
            await Comments.remove({ _id: id })
            return {
                success: `Comments by id: ${id} is deleted.`
            };
        } catch (err) {
            return {
                error: err.message,
                status: 500
            };
        };
    };
};

