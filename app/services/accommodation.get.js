/**
 * Get an accommodation's data and ratings by its id
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
 * Find the ratio of each traveledWith type of the reviews
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @return {Function}
 */
function calculateTraveledWithRatios(req, res) {

  return function(callback) {

    var traveledWithTypes = di.config.getTraveledWithTypes();
    var traveledWithRatios= {};
    var traveledWithFrequencies = di.data.countTraveledWithFrequencies(req.params.id);
    var reviewsCount = di.data.countReviews(req.params.id);

    // Foreach traveled with type, calculate the ratio
    traveledWithTypes.forEach(function(traveledWithType) {

      var traveledWithFrequency = traveledWithFrequencies[traveledWithType];

      // No reviews with the current traveled with type
      if (typeof traveledWithFrequency == 'undefined') {
        return traveledWithRatios[traveledWithType] = 0;
      }

      traveledWithRatios[traveledWithType] = di.lodash.round(traveledWithFrequency / reviewsCount, 2);

    });

    callback(null, traveledWithRatios);

  };

}

/**
 * Calculate the reviewsCount and the reviewsSummation
 * of the scores of all ratings aspects and group the results by submission year
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @return {Function}
 */
function aggregateRatings(req, res) {

  return function(traveledWithRatios, callback) {

    // Grouped by years of reviews submissions
    var aggregatedRatings = di.data.aggregateRatings(req.params.id);

    callback(null, traveledWithRatios, aggregatedRatings);

  };

}

/**
 * Calculate the weighted averages of the general rating
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @return {Function}
 */
function calculateGeneralRatingAverages(req, res) {

  return function(traveledWithRatios, aggregatedRatings, callback) {

    var generalRatingAverage = 0;
    var generalRatingSummation = 0;
    var generalRatingCount = 0;

    // Foreach year, apply reviews weights
    di.lodash.forIn(aggregatedRatings, function(data, year) {

      var reviewWeight = calculateReviewWeight(year);

      // Apply reviews weights for the general rating score
      data.ratings.general.general.reviewsSummation *= reviewWeight;
      data.ratings.general.general.reviewsCount *= reviewWeight;

      generalRatingSummation += data.ratings.general.general.reviewsSummation;
      generalRatingCount += data.ratings.general.general.reviewsCount;

    });

    // Check if there are reviews
    if (generalRatingCount != 0) {
      generalRatingAverage = di.lodash.round(generalRatingSummation / generalRatingCount);
    }

    callback(null, traveledWithRatios, aggregatedRatings, generalRatingAverage);

  };

}

/**
 * Calculate the weighted averages of each rating aspects
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @return {Function}
 */
function calculateRatingAspectsAverages(req, res) {

  return function(traveledWithRatios, aggregatedRatings, generalRatingAverage, callback) {

    // Fill with the rating aspects with their default values
    var aspectsRatingAverages = di.config.getRatingAspects();
    var aspectsRatingSummations = di.config.getRatingAspects();
    var aspectsRatingCounts = di.config.getRatingAspects();

    // Foreach year, apply reviews weights
    di.lodash.forIn(aggregatedRatings, function(data, year) {

      var reviewWeight = calculateReviewWeight(year);

      // Foreach rating aspect, apply reviews weights
      di.lodash.forIn(data.ratings.aspects, function(score, aspectType) {

        data.ratings.aspects[aspectType].reviewsSummation *= reviewWeight;
        data.ratings.aspects[aspectType].reviewsCount *= reviewWeight;
        aspectsRatingSummations[aspectType] += data.ratings.aspects[aspectType].reviewsSummation;
        aspectsRatingCounts[aspectType] += data.ratings.aspects[aspectType].reviewsCount;

      });

    });

    // Foreach rating aspect, calculate the averages
    di.lodash.forIn(di.config.getRatingAspects(), function(defaultScore, aspectType) {

      var aspectRatingCount = aspectsRatingCounts[aspectType];
      var aspectRatingSummation = aspectsRatingSummations[aspectType];

      // No reviews for the current aspect type
      if (aspectRatingCount == 0) {
        return aspectsRatingAverages[aspectType] = defaultScore;
      }

      aspectsRatingAverages[aspectType] = di.lodash.round(aspectRatingSummation / aspectRatingCount, 1);

    });

    callback(null, traveledWithRatios, generalRatingAverage, aspectsRatingAverages);

  };

}

/**
 * Format the output
 *
 * @param  {Object}   req
 * @param  {Object}   res
 * @return {Function}
 */
function formatOutput(req, res) {

  return function(traveledWithRatios, generalRatingAverage, aspectsRatingAverages, callback) {

    callback(null, {
      id: req.params.id,
      reviewsCount: di.data.countReviews(req.params.id),
      traveledWithRatios: traveledWithRatios,
      ratings: {
        general: {
          general: generalRatingAverage
        },
        aspects: aspectsRatingAverages
      },
    });

  };

}

////////////////////////////////////////////////////
// Helpers /////////////////////////////////////////
////////////////////////////////////////////////////

/**
 * Calculate a review weight
 * 
 * Each review has a weight according to its year of submission,
 * such that the newer review the higher impact on the final score.
 *
 * The weight formula:
 * 
 * - When the year is older than 5 years its weight value defaults to 0.5
 * - Otherwise it equals: 1 - (currentYear - reviewYear) * 0.1
 *
 * @param  {Number} year
 * @return {Number}
 */
function calculateReviewWeight(year) {

  var now = new Date();
  var currentYear = now.getFullYear();

  if (currentYear - year > 5) {
    return 0.5;
  }

  return 1 - (currentYear - year) * 0.1;

}

////////////////////////////////////////////////////
// Tasks ///////////////////////////////////////////
////////////////////////////////////////////////////

module.exports = [

  // Check if the passed id is a valid accommodation id
  isValidAccommodationId,

  // Find the ratio of each traveledWith type of the reviews
  calculateTraveledWithRatios,

  // Calculate the reviewsCount and the reviewsSummation
  aggregateRatings,

  // Calculate the weighted averages of the general rating
  calculateGeneralRatingAverages,

  // Calculate the weighted averages of each rating aspects
  calculateRatingAspectsAverages,

  // Format the output
  formatOutput

];
