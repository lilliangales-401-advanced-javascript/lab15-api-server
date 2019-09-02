'use strict';

const User = require('../model/user.js');

// Authentication
// -> What type of auth?
// -> parse user credentials
// -> generateToken

/**
 *
 * Authorization Middleware.
 * @module src/middleware/auth
 */

/**
 * This is the authorization middleware
 * @param req {object} (request object)
 * @param res {object} (response object)
 * @param next
 * @returns {Promise<T>}
 */
module.exports = (req, res, next) => {
  try {
    // let auth = req.headers.authorization;
    let [authType, authString] = req.headers.authorization.split(/\s+/);

    switch (authType.toLowerCase()) {
    case 'basic':
      // check credentials
      let base64Buffer = Buffer.from(authString, 'base64'); // binary string
      let BufferString = base64Buffer.toString(); // username:password
      let [username, password] = BufferString.split(':');
      return User.authenticateBasic({ username, password })
        .then(user => {
          req.user = user;
          req.token = user.generateToken();
          next();
        })
        .catch(() => next('Invalid Username or Password'));
    case 'bearer':
      // check for a token
      // validate token
      return User.authenticateToken(authString)
        .then(user => {
          req.user = user;
          req.token = user.generateToken();
          next();
        })
        .catch(() => next('Invalid Token'));
    default:
      next('Unauthorized');
    }
  } catch (e) {
    next(e);
  }

};
