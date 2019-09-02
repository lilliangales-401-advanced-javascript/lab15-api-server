'use strict';
const express = require('express');
const apiRouter = express.Router();
const User = require('./model/user.js');
const Post = require('./model/post.js');
const auth = require('./middleware/auth.js');

/** This is a route to signup
 * @route POST /signup
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} send req.token
 */
apiRouter.post('/signup', (req, res, next) => {
  // create a new user
  const user = new User(req.body);
  // save
  user.save()
    .then((user) => {
      let token = user.generateToken();
      res.cookie('auth', token);
      res.set('token', token);
      res.status(200);
      res.send(token);
    })
    .catch((err) => next(err));
});
// Basic check credentials with middleware
/** This is a route to signin
 * @route POST /signin
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} send req.token
 */
apiRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});


module.exports = apiRouter;