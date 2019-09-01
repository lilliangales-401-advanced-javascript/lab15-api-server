'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
})

// authenticate user => Basic
userSchema.statics.authenticateBasic = function (auth) {
  let query = { username: auth.username };
  return this.findOne(query)
    .then(user => {
      return user.comparePassword(auth.password)
    })
    .catch(error => {
      throw error;
    });
}

userSchema.statics.createFromOauth = function (email) {
  if (!email) { return Promise.reject('Validation Error'); }

  return this.findOne({ email })
    .then(user => {
      if (!user) { throw new Error('User Not Found'); }
      return user;
    })
    .catch(error => {
      let username = email;
      let password = 'none';
      return this.create({ username, password, email });
    });
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(isValid => isValid ? this : null);
}

// authenticate token => Bearer
userSchema.statics.authenticateToken = function (token) {
  try {
    let decryptedToken = jwt.verify(token, process.env.SECRET);
    return this.findOne({ _id: decryptedToken.id });
  } catch (e) {
    throw new Error('Invalid Token');
  }
}

// generates a token
userSchema.methods.generateToken = function () {
  let object = {
    id: this._id
  }
  return jwt.sign(object, process.env.SECRET);
}

module.exports = mongoose.model('Users', userSchema);