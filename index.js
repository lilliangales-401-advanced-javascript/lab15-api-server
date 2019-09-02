'use strict';

const mongoose = require('mongoose');
const app = require('./src/app.js');

mongoose.connect('mongodb://localhost:27017/db', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.start(3000);