'use strict';

module.exports = (req, res, next) => {
  res.status(404);
  res.send({ Error: 'Resource not found' });
}