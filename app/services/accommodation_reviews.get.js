/**
 * Get a list of reviews for a specific accommodation
 *
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * Check if the passed id is a valid accommodation id
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @return {Function}
 */
function isValidAccommodationId(req, res) {

  return function(callback) {

    // Is not a valid accommodation id 
    if (!di.data.isValidAccommodationId(req.params.id)) {
      res.status(404);
      return callback(di.text.get('NOT_FOUND_ACCOMMODATION'));
    }

    callback();

  };

}

/**
 * Get a list of reviews for a specific accommodation
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @return {Function}
 */
function getReviews(req, res) {

  return function(callback) {

    var result = di.data.getReviews(req.params.id, req.params.page,
                                    req.params.limit, req.params.order,
                                    req.params.orderDirection, req.params.traveledWith);

    res.setExtraMeta('returned_records_count', result.reviews.length);
    res.setExtraMeta('total_records_count', result.meta.totalRecordsCount);
    res.setExtraMeta('pages_count', result.meta.pagesCount);

    callback(null, result.reviews);

  };

}

////////////////////////////////////////////////////
// Tasks ///////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = [

  isValidAccommodationId,

  // Send the passed params again to the user
  getReviews

];
