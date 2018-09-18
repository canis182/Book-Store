const mongoose = require('mongoose');

const { Schema } = mongoose;
const User = require('./user');

const imgSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  path: {
    type: String,
    require: true,
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    require: true,
  },
});

module.exports = mongoose.model('Img', imgSchema);
