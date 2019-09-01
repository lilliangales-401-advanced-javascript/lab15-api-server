'use strict';

const cwd = process.cwd();

const express = require('express');

const modelFinder = require(`${cwd}/src/middleware/model-finder.js`);

const router = express.Router();

router.param('model', modelFinder.load);

/**
 * Get a list of records for a given model
 * Model must be a proper model, located within the ../models folder
 * @route GET /posts
 * @returns {object} 200 { count: 2, results: [ {}, {} ] }
 * @returns {Error}  500 - Server error
 */

router.get('/api/v1/categories', (request, response) => {
  modelFinder.list()
    .then(categories => response.status(200).json(categories));
});

router.get('/api/v1/categories/schema', (request, response) => {
  response.status(200).json(request.model.jsonSchema());
});


router.get('/api/v1/categories', handleGetAll);
router.post('/api/v1/categories', handlePost);
router.get('/api/v1/categories/:id', handleGetOne);
router.put('/api/v1/categories/:id', handlePut);
router.delete('/api/v1/categories/:id', handleDelete);

// Route Handlers
/**
 *
 * @param request
 * @param response
 * @param next
 */
function handleGetAll(request,response,next) {
  request.model.get()
    .then( data => {
      const output = {
        count: data.length,
        results: data,
      };
      response.status(200).json(output);
    })
    .catch( next );
}

/**
 *
 * @param request
 * @param response
 * @param next
 */
function handleGetOne(request,response,next) {
  request.model.get(request.params.id)
    .then( result => response.status(200).json(result[0]) )
    .catch( next );
}

/**
 *
 * @param request
 * @param response
 * @param next
 */
function handlePost(request,response,next) {
  request.model.create(request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 *
 * @param request
 * @param response
 * @param next
 */
function handlePut(request,response,next) {
  request.model.update(request.params.id, request.body)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

/**
 *
 * @param request
 * @param response
 * @param next
 */
function handleDelete(request,response,next) {
  request.model.delete(request.params.id)
    .then( result => response.status(200).json(result) )
    .catch( next );
}

module.exports = router;