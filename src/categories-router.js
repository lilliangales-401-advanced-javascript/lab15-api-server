'use strict';

const express = require('express');
const router = express.Router();

// Middleware
const auth = require('./middleware/auth.js');


/**
 * Get a list of categories
 * @route GET /api/v1/categories
 * @returns {object} 200 { count: 2, results: [ {}, {} ] }
 * @returns {Error}  500 - Server error
 */
router.get('/api/v1/categories', auth, getCategories);
/**
 * Post for a given model
 * @route POST /api/v1/categories
 * @returns {object} 200 { result }
 * @returns {Error}  500 - Server error
 */
router.post('/api/v1/categories', auth, postCategories);
/**
 * Get information for one given id
 * @route GET /api/v1/categories/:id
 * @returns {object} 200 { result }
 * @returns {Error}  500 - Server error
 */
router.get('/api/v1/categories/:id', auth, getCategory);
/**
 * Put for a given id & model
 * @route PUT /api/v1/categories/:id
 * @returns {object} 200 { result }
 * @returns {Error}  500 - Server error
 */
router.put('/api/v1/categories/:id', auth, putCategories);
/**
 * Delete for a given id & model
 * @route DELETE /api/v1/categories/:id
 * @returns {object} 200 { result }
 * @returns {Error}  500 - Server error
 */
router.delete('/api/v1/categories/:id', auth, deleteCategories);


// Models
const Categories = require('./model/categories/categories-model');
const categories = new Categories();

function getCategories(request,response,next) {
  // expects an array of object to be returned from the model
  categories.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

function getCategory(request,response,next) {
  // expects an array with the one matching record from the model
  categories.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

function postCategories(request,response,next) {
  // expects the record that was just added to the database
  categories.post(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}


function putCategories(request,response,next) {
  // expects the record that was just updated in the database
  categories.put(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

// TODO: PATCH

function deleteCategories(request,response,next) {
  // Expects no return value (resource was deleted)
  categories.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;