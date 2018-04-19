/**
 * Change The Case for Objects Keys
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Change the case of an object keys recursively
 * 
 * @param  {Object|Array} data
 * @param  {String}       type one of (camel, pascal, title, snake, lower, upper, constant)
 * @return {Object}
 */
function objectChangeCase(data, type) {

  var result = di.is.array(data) ? [] : {};
  var caseChangeMethod = di.changeCase[type];

  for (var i in data) {

    var value = data[i];

    // Is the data an object or an array
    if (di.is.object(value) || di.is.array(value)) {
      value = objectChangeCase(value, type);
    }

    // Is an array
    if (di.is.array(data)) {
      result.push(value)
    } else {
      result[caseChangeMethod(i)] = value;
    }

  }

  return result;
  
}

/**
 * Change the case of an object keys
 * 
 * @param  {Object|Array} data
 * @param  {String}       type one of (camel, pascal, title, snake, lower, upper, constant)
 * @return {Object|Array}
 */
module.exports = function(data, type) {

  if (di.is.array(data)) {

    var result = [];

    // Foreach element in the array
    for (var i in data) {
      result.push(objectChangeCase(data[i], type));
    }

    return result;

  }

  return objectChangeCase(data, type);

};
