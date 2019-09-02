'use strict';

const Model = require('../mongo');
const schema = require('./categories-schema.js');


/**
 * @class
 * @constructor
 */
class Categories extends Model {
  constructor() { super(schema); }
}

module.exports = Categories;
