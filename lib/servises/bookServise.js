const Mongoose = require('mongoose');
const Book = require('../models/book');
const Comment = require('../models/comment');
const User = require('../models/user.js')
const schema = require('../validateSchemas/schemas');
const Joi = require('joi');
const moment = require('moment');

module.exports = class BookServise {
    static async search(data) {
        const correctDataSearch = data.replace(/(?<=\s|^)[a-z]/ig, e => e.toUpperCase());
        //search book for name
        const searchForName = await Book.findOne({ name: correctDataSearch }, { _id: 0, text: 0, __v: 0 });

        if (!searchForName) {
            //search book for author
            const searchForAuthor = await Book.find({ author: correctDataSearch }, { _id: 0, text: 0, __v: 0 })
            if (searchForAuthor.length < 1) {
                return {
                    error: `Sorry, but nothing found on request.`,
                    status: 404
                };
            };
            if (searchForAuthor.comments !== undefined) {
                searchForAuthor.comments.reverse()
            };
            return {
                success: searchForAuthor
            };
        };
        if (searchForName.comments !== undefined) {
            searchForName.comments.reverse()
        };
        return {
            success: searchForName
        };
    };

    static async readBook(data) {
        const bookId = data;
        const validId = await Joi.validate(bookId, schema.validateSchemaForReadAReadRequest)
        const searchBook = await Book.findOne({ _id: bookId }, { text: 1, _id: 0 });

        if (!searchBook) {
            return {
                error: `The book under such id is absent.`,
                status: 404
            };
        };

        return {
            success: searchBook
        };
    };

    static async addComment(data) {
        const searchBook = await Book.findOne({ _id: data.bookId }); 3
        if (!searchBook) {
            return {
                error: `Book is not found.`,
                status: 404
            };
        };
        //test comment user for validate
        const validateComment = await Joi.validate(data.comment, schema.validateSchemaForComment);
        const createNewComment = await new Comment({
            comment: validateComment,
            data: moment().format('LLL'),
            user: data.nickname,
            book: Book
        }).save();
        const newComment = JSON.parse(JSON.stringify(createNewComment))
        await Book.findByIdAndUpdate({ _id: data.bookId }, { $push: { comments: newComment } })
        return {
            success: 'Comment added.'
        };
    };

    static async addBook(data) {
        const newBook = data;
        // search this book in db
        const searchBook = await Book.findOne({ name: newBook.name, author: newBook.author })

        if (searchBook) {
            return {
                error: `This book already exists!`,
                status: 404
            };
        };

        // test new book to validate
        const { name, author, description, text, comments } = await Joi.validate(newBook, schema.validateSchemaForNewBook);
        // entry new book in db
        await new Book({ name, author, description, text, comments }).save();
        return {
            succsess: `New Book was create!`
        };
    };

    static async changeBook(data) {
        // key-value array of new elements
        const arrayElements = Object.entries(data.changeElement);
        const searchBook = await Book.findOne({ _id: data.bookId });

        if (!searchBook) {
            return {
                error: `The book under such id is absent.`,
                status: 404
            };
        };

        for (let i = 0; i < arrayElements.length; i++) {
            let key = arrayElements[i][0];
            let value = arrayElements[i][1];
            let validTest = {};
            validTest[key] = value;
            const valid = await Joi.validate(validTest, schema.validateSchemaForChange)
            await Book.findByIdAndUpdate(data.bookId, { $set: { [key]: value } })
        };
        return {
            success: `Done!`
        };
    };
};

