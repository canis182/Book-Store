const mongoose = require('mongoose');
const { Schema } = mongoose;
const Mixed = mongoose.Schema.Types.Mixed;

const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    surname: String,
    nickname: {
        type: Mixed,
        require: true
    },
    age: Number,
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('User', userSchema);
