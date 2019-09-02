'use strict';

/**
 *
 * Page not found.
 * @module src/middleware/404
 */

/**
 *
 * @param err {object} (error object)
 * @param req {object} (request object)
 * @param res {object} (response object)
 * @param next {object} (next object)
 */

module.exports = (req, res, next) => {
  res.status(404);
  res.send({ Error: 'Resource not found' });
}