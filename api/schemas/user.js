const mongoose =  require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String,
  role: Number,
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.verifyPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return hash === this.password;
};

module.exports = mongoose.model('user', userSchema);