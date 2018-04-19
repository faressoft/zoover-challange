/**
 * Load, index, cache accommodations and reviews and provide utility methods
 * to query, sort, filter them. Uses the reviews.json resource.
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

/**
 * The path of the reviews file
 * 
 * @type {String}
 */
var REVIEWS_FILE_NAME = __dirname + '/../resources/reviews.json';

/**
 * An index for the accommodations with their reviews
 *
 * {
 *   accommodationId: {
 *     id,
 *     traveledWith: {type: count, ...}, 
 *     reviewsYears: {
 *       2018: { 
 *         ratings: {
 *           general: {
 *             general: {reviewsCount, reviewsSummation}
 *           },
 *           aspects: {
 *             aspectType: {reviewsCount, reviewsSummation},
 *             ...
 *           }
 *         }.
 *       },
 *       ...
 *     }
 *     reviews: [reviewObject, ...],
 *     reviewsIndexedByTraveledWith: {traveledWithType: [reviewObject, ..], ...}
 *   },
 *   ...
 * }
 * 
 * @type {Object}
 */
var data = {};

/**
 * Add a new review
 * 
 * @param {String} accommodationId
 * @param {Object} review
 */
function addReview(accommodationId, review) {

  // An alias for shorter lines
  var isDefined = di.is.propertyDefined;

  // A reference for the accommodation object
  var accommodation = data[accommodationId];

  // The submission year of the review
  var reviewYear = di.moment(review.entryDate).year();

  // To store a refernce to the year of the reviewsYears index
  var yearIndex = null;

  // Remove the parents object from the review object
  delete review.parents;

  // Add the review under its accommodation
  accommodation.reviews.push(review);

  // Is the traveledWith type not addded yet to the reviewsIndexedByTraveledWith
  if (!isDefined(accommodation.reviewsIndexedByTraveledWith, review.traveledWith)) {
    accommodation.reviewsIndexedByTraveledWith[review.traveledWith] = [];
  }

  // Index the review by traveledWith type
  accommodation.reviewsIndexedByTraveledWith[review.traveledWith].push(review);

  /**
   * Handle accumulative data
   */
  
  // Is the year not addded to the index yet
  if (!isDefined(accommodation.reviewsYears, reviewYear.toString())) {

    accommodation.reviewsYears[reviewYear] = {
      ratings: {
        general: {
          general: {reviewsCount: 0, reviewsSummation: 0}
        },
        aspects: {}
      }
    };

  }

  yearIndex = accommodation.reviewsYears[reviewYear];

  // Increment the general rating
  yearIndex.ratings.general.general.reviewsCount++;

  // Add the general rating of the current review
  yearIndex.ratings.general.general.reviewsSummation += review.ratings.general.general;

  // Is the traveledWith type not addded yet
  if (!isDefined(accommodation.traveledWith, review.traveledWith)) {
    accommodation.traveledWith[review.traveledWith] = 0;
  }

  // Increment the traveledWith type
  accommodation.traveledWith[review.traveledWith]++;

  // Foreach aspect
  di.lodash.forIn(review.ratings.aspects, function(rating, aspectType) {

    // Is the aspect type not addded yet
    if (!isDefined(yearIndex.ratings.aspects, aspectType)) {
      yearIndex.ratings.aspects[aspectType] = {reviewsCount: 0, reviewsSummation: 0};
    }

    // Not entered rating, discard
    if (rating == 0) {
      return;
    }

    // Increment the aspect type's count
    yearIndex.ratings.aspects[aspectType].reviewsCount++;

    // Add the rating of aspect of the current review
    yearIndex.ratings.aspects[aspectType].reviewsSummation += rating;

  });

}

/**
 * Cache and index the loaded data
 * 
 * @param {Array} reviews
 */
function index(reviews) {

  // Foreach review
  reviews.forEach(function(review) {

    // Ids
    var accommodationId = review.parents[0].id;
    var reviewId = review.id;

    // An alias for shorter lines
    var isDefined = di.is.propertyDefined;

    // Is the accommodation not addded yet
    if (!isDefined(data, accommodationId)) {

      // Add a new accommodation object
      data[accommodationId] = {
        id: accommodationId,
        traveledWith: {},
        reviewsYears: {},
        reviews: [],
        reviewsIndexedByTraveledWith: {}
      }

    }

    // Add a new review
    addReview(accommodationId, review);

  });

}

/**
 * Get an accommodation by its id
 *
 * {
 *   id,
 *   traveledWith: {type: average, ...}, 
 *   ratings: {
 *     general: {
 *       general: average
 *     },
 *     aspects: {
 *       aspectType: average,
 *       ...
 *     }
 *   }
 * }
 * 
 * @param  {String}      id
 * @return {Object|Null} return null if not found
 */
function getAccommodation(id) {

  // The accommodation is not found
  if (di.is.not.propertyDefined(data, id)) {
    return null;
  }

  // Shallow copy
  var accommodation = Object.assign({}, data[id]);;
  var reviewsCount = accommodation.reviews.length;

  // Remove the reviews
  delete accommodation.reviews;
  delete accommodation.reviewsIndexedByTraveledWith;

  return accommodation;

}

/**
 * Get a unique list of reviews submission years
 * 
 * @param  {String}     id the accommodation id
 * @return {Array|Null}
 */
function getReviewsYears(id) {

  // The accommodation is not found
  if (di.is.not.propertyDefined(data, id)) {
    return null;
  }

  return Object.keys(data[id].reviewsYears);

}

/**
 * Get the number of reviews
 * 
 * @param  {String}      id the accommodation id
 * @return {Number|Null}
 */
function countReviews(id) {

  // The accommodation is not found
  if (di.is.not.propertyDefined(data, id)) {
    return null;
  }

  return data[id].reviews.length;

}

/**
 * Count the frequencies of each traveledWith type
 * of the reviews of an aaccommodation
 * 
 * @param  {String}      id the accommodation id
 * @return {Object|Null} {traveledWithType: count, ...}
 */
function countTraveledWithFrequencies(id) {

  // The accommodation is not found
  if (di.is.not.propertyDefined(data, id)) {
    return null;
  }

  return data[id].traveledWith;

}

/**
 * Calculate the reviewsCount and the reviewsSummation
 * of the scores of all ratings aspects and group the results by submission year
 *
 * {
 *   2018: { 
 *     ratings: {
 *       general: {
 *         general: {reviewsCount, reviewsSummation}
 *       },
 *       aspects: {
 *         aspectType: {reviewsCount, reviewsSummation},
 *         ...
 *       }
 *     }.
 *   },
 *   ...
 * }
 * 
 * @param  {String}      id the accommodation id
 * @return {Object|Null}
 */
function aggregateRatings(id) {

  // The accommodation is not found
  if (di.is.not.propertyDefined(data, id)) {
    return null;
  }

  return di.deepcopy(data[id].reviewsYears);

}

/**
 * Get a list of reviews by their accommodation id
 * 
 * Thrown errors:
 * - Invalid limit value
 * - Invalid limit value
 * - Invalid orderBy value
 * - Invalid orderDirection value
 * - Invalid traveledWithFilter value
 * 
 * @param  {String}      id                 the accommodation id
 * @param  {Number}      page               the page number (> 0)
 * @param  {Number}      limit              the max number of returned elements
 * @param  {String|Null} orderBy            entryDate, travelDate (Default: null) (Optional)
 * @param  {String|Null} orderDirection     asc or desc (Default: asc) (Optional)
 * @param  {String}      traveledWithFilter filter the reviews according to their traveledWith type (Optional)
 * @return {Object|Null} {meta: {totalRecordsCount, pagesCount}, reviews: []}
 */
function getReviews(id, page, limit, orderBy, orderDirection, traveledWithFilter) {

  // The accommodation is not found
  if (di.is.not.propertyDefined(data, id)) {
    return null;
  }

  // To store the results
  var result = {
    meta: {
      totalRecordsCount: 0,
      pagesCount: 0
    },
    reviews: []
  };

  // Default value for orderBy
  if (typeof orderBy == 'undefined') {
    orderBy = null;
  }

  // Default value for orderDirection
  if (typeof orderDirection == 'undefined' || !orderDirection) {
    orderDirection = 'asc';
  }

  // Default value for traveledWithFilter
  if (typeof traveledWithFilter == 'undefined') {
    traveledWithFilter = null;
  }

  // Invalid limit value
  if (di.is.not.number(page) || page < 1) {
    throw new Error('Invalid limit value');
  }

  // Invalid limit value
  if (di.is.not.number(limit) || limit < 1) {
    throw new Error('Invalid limit value');
  }

  // Invalid orderBy value
  if (orderBy && di.is.not.inArray(orderBy, ['entryDate', 'travelDate'])) {
    throw new Error('Invalid orderBy value');
  }

  // Invalid orderDirection value
  if (orderDirection && di.is.not.inArray(orderDirection, ['asc', 'desc'])) {
    throw new Error('Invalid orderDirection value');
  }

  // Invalid traveledWithFilter value
  if (traveledWithFilter && di.is.not.string(traveledWithFilter)) {
    throw new Error('Invalid traveledWithFilter value');
  }

  // The traveledWithFilter is specified
  if (traveledWithFilter) {

    // No reviews with the passed traveledWithFilter
    if (di.is.not.propertyDefined(data[id].reviewsIndexedByTraveledWith, traveledWithFilter)) {
      return result;
    }

    // To get the reviews
    result.reviews = data[id].reviewsIndexedByTraveledWith[traveledWithFilter];

  } else {

    // To get the reviews
    result.reviews = data[id].reviews;

  }

  // Sorting is required
  if (orderBy) {

    result.reviews.sort(function(a, b) {

      // Sort in ascending order
      if (orderDirection == 'asc') {
        return a[orderBy] - b[orderBy];
      }

      return b[orderBy] - a[orderBy];

    });

  }

  // Set meta data
  result.meta.totalRecordsCount = result.reviews.length;
  result.meta.pagesCount = Math.ceil(result.reviews.length / limit);

  // Pagination
  result.reviews = result.reviews.slice((page - 1) * limit, page * limit);

  return result;
  
}

/**
 * Check if the id is a valid accommodation id
 * 
 * @param  {String}  id
 * @return {Boolean}
 */
function isValidAccommodationId(id) {

  return di.is.propertyDefined(data, id);

}

/**
 * Load and cache texts resource
 * 
 * @return {Promise}
 */
function load() {

  return new Promise(function(resolve, reject) {
      
    di.fs.readFile(REVIEWS_FILE_NAME, 'utf8', function(error, result) {

      if (error) {
        return reject(error);
      }

      try {

        // Parse the data
        result = JSON.parse(result);

      } catch (error) {

        return reject(new Error('Failed to parse the reviews.json resource'));

      }

      // Cache and index the loaded data
      index(result);

      resolve();

    });
    
  });

}

////////////////////////////////////////////////////
// Module //////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = {
  load: load,
  getAccommodation: getAccommodation,
  getReviewsYears: getReviewsYears,
  countReviews: countReviews,
  countTraveledWithFrequencies: countTraveledWithFrequencies,
  aggregateRatings: aggregateRatings,
  isValidAccommodationId: isValidAccommodationId,
  getReviews: getReviews
};
