const mongoose = require('mongoose');
const { Schema } = mongoose;
const Book = require('./book');

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    user: String,
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Book,
        required: true
    }
});

module.exports = mongoose.model('comment', commentSchema)

