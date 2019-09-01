'use strict';

const Model = require('../mongo');
const schema = require('./categories-schema.js');

/**
 *
 * Categories model.
 * @module src/models/categories/categories-model
 */



/**
 * @class
 * @constructor
 */
class Categories extends Model {
  constructor() { super(schema); }
}

module.exports = Categories;
