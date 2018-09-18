const Joi = require('joi');
const moment = require('moment');
const Book = require('../models/book');
const Comment = require('../models/comment');
const schema = require('../validateSchemas/schemas');

module.exports = class BookServise {
  static async search(data) {
    try {
      // search book for name
      const correctDataSearch = new RegExp(`(${data})`, 'i');
      const searchForName = await Book.find(
        { name: correctDataSearch },
        { _id: 0, text: 0, __v: 0 },
      );
      const searchForAuthor = await Book.find(
        { author: correctDataSearch },
        { _id: 0, text: 0, __v: 0 },
      );

      if (searchForName.length < 1 && searchForAuthor.length < 1) {
        return {
          error: 'Sorry, but nothing found on request.',
          status: 404,
        };
      }
      return {
        success: {
          searchForNameBook: searchForName,
          searchForAuthorName: searchForAuthor,
        },
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500,
      };
    }
  }

  static async readBook(data) {
    try {
      const bookId = data;
      await Joi.validate(bookId, schema.validateSchemaForReadAReadRequest);
      const searchBook = await Book.findOne({ _id: bookId }, { text: 1, _id: 0 });

      if (!searchBook) {
        return {
          error: 'The book under such id is absent.',
          status: 404,
        };
      }

      return {
        success: searchBook,
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500,
      };
    }
  }

  static async addComment(data) {
    try {
      const searchBook = await Book.findOne({ _id: data.bookId });

      if (!searchBook) {
        return {
          error: 'Book is not found.',
          status: 404,
        };
      }

      // test comment user for validate
      await Joi.validate(data.comment, schema.validateSchemaForComment);
      const createNewComment = await new Comment({
        comment: data.comment,
        data: moment().format('LLL'),
        user: data.nickname,
        book: data.bookId,
      }).save();
      const newComment = JSON.parse(JSON.stringify(createNewComment));
      await Book.findByIdAndUpdate({ _id: data.bookId }, { $push: { comments: newComment } });
      return {
        success: 'Comment added.',
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500,
      };
    }
  }

  static async addBook(data) {
    try {
      const newBook = data;
      // search this book in db
      const searchBook = await Book.findOne({ name: newBook.name, author: newBook.author });

      if (searchBook) {
        return {
          error: 'This book already exists!',
          status: 404,
        };
      }

      // test new book to validate
      const {
        name, author, description, text, comments,
      } = await Joi.validate(newBook, schema.validateSchemaForNewBook);
      // entry new book in db
      await new Book({
        name, author, description, text, comments,
      }).save();
      return {
        succsess: 'New Book was create!',
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500,
      };
    }
  }

  static async changeBook(data) {
    try {
      // key-value array of new elements
      const arrayElements = Object.entries(data.changeElement);
      const searchBook = await Book.findOne({ _id: data.bookId });

      if (!searchBook) {
        return {
          error: 'The book under such id is absent.',
          status: 404,
        };
      }
      for (let i = 0; i < arrayElements.length; i++) {
        const key = arrayElements[i][0];
        const value = arrayElements[i][1];
        const validTest = {};
        validTest[key] = value;
        new Promise((resolve) => {
          resolve(Joi.validate(validTest, schema.validateSchemaForChange));
        })
          .then(() => Book.findByIdAndUpdate(data.bookId, { $set: { [key]: value } }));
      }
      return {
        success: 'Done!',
      };
    } catch (err) {
      return {
        error: err.message,
        status: 500,
      };
    }
  }
};
