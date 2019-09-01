'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./model/user.js');
const Post = require('./model/post.js');
const auth = require('./middleware/auth.js');

authRouter.post('/signup', (req, res, next) => {
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
authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/oauth', (req, res, next) => {
  oauth.authorize(req)
    .then(token => {
      res.send(token);
    })
    .catch(next)
})

authRouter.get('/posts', auth, (req, res, next) => {
  Post.find({})
    .then(posts => {
      res.status(200);
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(posts);
    })
    .catch(err => next(err));
})

module.exports = authRouter;