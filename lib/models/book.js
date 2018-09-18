const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Mixed } = Schema.Types;

const bookSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  description: Mixed,
  text: {
    type: Mixed,
    require: true,
  },
  comments: Array,
});

module.exports = mongoose.model('Book', bookSchema);
