exports.mungLocation = (locationAPIObject) => {
  const mungedLocation = {
    'formatted_query': locationAPIObject.body[0].display_name,
    'latitude': locationAPIObject.body[0].lat,
    'longitude': locationAPIObject.body[0].lon
  };
  return mungedLocation;
};

exports.mungWeather = (weatherAPIObject) => {
  const weatherArray = [];
  const exampleObject = {
    forecast: 'Sunny',
    time: '2020-11-10'
  };

  weatherAPIObject.body.data.map(item => {
    const singleDay = Object.create(exampleObject);
    singleDay.forecast = item.weather.description;
    singleDay.time = item.valid_date;
    weatherArray.push(singleDay);
  });
  return weatherArray;
};

exports.mungReviews = (reviewsAPIObject) => {
  const yelpArray = [];
  const exampleObject = {
    'name': 'Pike Place Chowder',
    'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/ijju-wYoRAxWjHPTCxyQGQ/o.jpg',
    'price': '$$',
    'rating': '4.5',
    'url': 'https://www.yelp.com/biz/pike-place-chowder-seattle?adjust_creative=uK0rfzqjBmWNj6-d3ujNVA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=uK0rfzqjBmWNj6-d3ujNVA'
  };

  reviewsAPIObject.body.businesses.map(item => {
    const singleYelp = Object.create(exampleObject);
    singleYelp.name = item.name;
    singleYelp.image_url = item.image_url;
    singleYelp.price = item.price;
    singleYelp.rating = item.rating;
    singleYelp.url = item.url;
    yelpArray.push(singleYelp);
  });

  return yelpArray;
};

exports.mungTrails = (trailsAPIObject) => {
  const trailArray = [];
  const exampleObject = {
    'name': 'Rattlesnake Ledge',
    'location': 'Riverbend, Washington',
    'length': '4.3',
    'stars': '4.4',
    'star_votes': '84',
    'summary': 'An extremely popular out-and-back hike to the viewpoint on Rattlesnake Ledge.',
    'trail_url': 'https://www.hikingproject.com/trail/7021679/rattlesnake-ledge',
    'conditions': 'Dry: The trail is clearly marked and well maintained.',
    'condition_date': '2018-07-21',
    'condition_time': '0:00:00 '
  };

  trailsAPIObject.body.trails.map(item => {
    const singleTrail = Object.create(exampleObject);
    singleTrail.name = item.name;
    singleTrail.location = item.location;
    singleTrail.length = item.length;
    singleTrail.stars = item.stars;
    singleTrail.star_votes = item.star_votes;
    singleTrail.summary = item.summary;
    singleTrail.trail_url = item.url;
    singleTrail.conditions = `${item.conditionStatus}: ${item.conditionDetails}`;
    singleTrail.condition_date = item.conditionDate.substring(0, 10);
    singleTrail.condition_time = item.conditionDate.substring(11, 19);
    trailArray.push(singleTrail);
  });

  return trailArray;
};
