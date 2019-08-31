'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./roles-model.js');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '5m';
const SECRET = process.env.SECRET || 'foobar';

const usedTokens = new Set();

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','editor','user']},
});

const capabilities = {
  admin: ['create','read','update','delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => {throw new Error(error);});
});

users.statics.createFromOauth = function(email) {

  if(! email) { return Promise.reject('Validation Error'); }

  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      return user;
    })
    .catch( error => {
      let username = email;
      let password = 'none';
      return this.create({username, password, email});
    });

};

users.statics.authenticateToken = function(token) {

  if ( usedTokens.has(token ) ) {
    return Promise.reject('Invalid Token');
  }

  try {
    let parsedToken = jwt.verify(token, SECRET);
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  } catch(e) { throw new Error('Invalid Token'); }

};

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

users.methods.generateToken = function(type) {

  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || 'user',
  };

  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) {
    options = { expiresIn: TOKEN_EXPIRE };
  }

  return jwt.sign(token, SECRET, options);
};

users.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};

users.methods.generateKey = function() {
  return this.generateToken('key');
};

module.exports = mongoose.model('users', users);



// 'use strict';
//
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
//
// // Global variable
// let used_tokens = {};
//
// const users = new mongoose.Schema({
//   username: {type:String, required:true, unique:true},
//   password: {type:String, required:true},
//   email: {type: String},
//   role: {type: String, default:'user', enum: ['admin','editor','user']},
// });
//
// users.pre('save', function(next) {
//   bcrypt.hash(this.password, 10)
//     .then(hashedPassword => {
//       this.password = hashedPassword;
//       next();
//     })
//     .catch(console.error);
// });
//
// /**
//  *
//  * @param email
//  * @returns {Promise<never>|Promise<unknown>}
//  */
// users.statics.createFromOauth = function(email) {
//
//   if(! email) { return Promise.reject('Validation Error'); }
//
//   return this.findOne( {email} )
//     .then(user => {
//       if( !user ) { throw new Error('User Not Found'); }
//       console.log('Welcome Back', user.username);
//       return user;
//     })
//     .catch( error => {
//       console.log('Creating new user');
//       let username = email;
//       let password = 'none';
//       return this.create({username, password, email});
//     });
//
// };
//
// // decrypt/verify and then find the user based on the id
// //
// /**
//  *
//  * @param token
//  * @returns {Query|void}
//  */
// users.statics.authenticateToken = function(token){
//
//   if (process.env.JWT_SINGLE_USE && token.type === 'token') {
//     // eslint-disable-next-line no-prototype-builtins
//     if (used_tokens.hasOwnProperty(token)) {
//       throw new Error();
//     } else {
//       let parsedToken = jwt.verify(token, process.env.SECRET);
//       let query = {_id: parsedToken.id};
//       used_tokens[token] = 'token';
//       return this.findOne(query);
//     }
//   } else {
//     let parsedToken = jwt.verify(token, process.env.SECRET);
//     let query = {_id: parsedToken.id};
//     return this.findOne(query);
//
//   }
// };
//
// /**
//  *
//  * @param auth
//  * @returns {Promise<unknown>}
//  */
// users.statics.authenticateBasic = function(auth) {
//   let query = {username:auth.username};
//   return this.findOne(query)
//     .then( user => user && user.comparePassword(auth.password) )
//     .catch(error => {throw error;});
// };
//
// /**
//  *
//  * @param password
//  * @returns {Promise<unknown>}
//  */
// users.methods.comparePassword = function(password) {
//   return bcrypt.compare( password, this.password )
//     .then( valid => valid ? this : null);
// };
//
// /**
//  *
//  * @returns {undefined|*}
//  */
// users.methods.generateToken = function(type) {
//
//
//   if(type) {
//     let token = {
//       id: this._id,
//       role: this.role,
//       type: 'key',
//     };
//     return jwt.sign(token, process.env.SECRET);
//   }
//
//   let token = {
//     id: this._id,
//     role: this.role,
//     type: 'token',
//   };
//
//
//   if (process.env.JWT_EXPIRES) {
//     let signOptions = {
//       expiresIn: process.env.JWT_EXPIRES,
//     };
//
//     return jwt.sign(token, process.env.SECRET, signOptions);
//   }
//   return jwt.sign(token, process.env.SECRET);
// };
//
//
//
// module.exports = mongoose.model('users', users);
