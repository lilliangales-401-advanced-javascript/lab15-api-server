'use strict';

const mongoose = require('mongoose');
const app = require('./src/app.js');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.start(3000);