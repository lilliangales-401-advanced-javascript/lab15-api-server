'use strict';

/**
 *
 * Internal server error module.
 * @module src/middleware/500
 */

/**
 *
 * @param err {object} (error object)
 * @param req {object} (request object)
 * @param res {object} (response object)
 * @param next {object} (next object)
 */

module.exports = (err, req, res, next) => {
  res.status(500);
  res.send({ Error: err });
}