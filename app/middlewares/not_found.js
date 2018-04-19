/**
 * Handle not found route
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
module.exports = function(req, res, next) {

  // Response wrapper
  res = new di.Response(res);

  // Failed status
  res.setStatus(false);
  res.status(404);

  // Send not found message
  res.error('Not Found');

  next();

};
