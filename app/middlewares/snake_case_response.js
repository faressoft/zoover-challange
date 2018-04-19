/**
 * Change the response keys to snake_case
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Change the response keys to snake_case
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports = function(req, res, next) {

  res.data = di.objectChangeCase(res.data, 'snake');

  next();

};
