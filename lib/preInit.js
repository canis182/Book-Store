const User = require('./models/user');
const { admin } = require('../configs/users');

exports.checkAdminInDb = () => User.findOne({ name: 'Admin' });
exports.createAdmin = () => User.create(admin).save();
