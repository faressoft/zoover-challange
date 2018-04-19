var obj = {
  accommodationId: {
    traveledWith: {type: count, ...}, 
    ratings: {
      general: {
        general: {
          reviewsSummation: 0,
          reviewsCount: 0
        }
      },
      aspects: {
        location: {reviewsSummation, reviewsCount},
        service: {reviewsSummation, reviewsCount},
        priceQuality: {reviewsSummation, pricereviewsCount},
        food: {reviewsSummation, reviewsCount},
        room: {reviewsSummation, reviewsCount},
        childFriendly: {reviewsSummation, childreviewsCount},
        interior: {reviewsSummation, reviewsCount},
        size: {reviewsSummation, reviewsCount},
        activities: {reviewsSummation, reviewsCount},
        restaurants: {reviewsSummation, reviewsCount},
        sanitaryState: {reviewsSummation, sanitaryreviewsCount},
        accessibility: {reviewsSummation, reviewsCount},
        nightlife: {reviewsSummation, reviewsCount},
        culture: {reviewsSummation, reviewsCount},
        surrounding: {reviewsSummation, reviewsCount},
        atmosphere: {reviewsSummation, reviewsCount},
        noviceSkiArea: {reviewsSummation, noviceSkireviewsCount},
        advancedSkiArea: {reviewsSummation, advancedSkireviewsCount},
        apresSki: {reviewsSummation, apresreviewsCount},
        beach: {reviewsSummation, reviewsCount},
        entertainment: {reviewsSummation, reviewsCount},
        environmental: {reviewsSummation, reviewsCount},
        pool: {reviewsSummation, reviewsCount},
        terrace: {reviewsSummation, reviewsCount}
      }
    },
    reviews: {
      reviewId: reviewObject,
      ...
    }
  },
  ...
}

console.log(obj);
