const express = require('express');
const cors = require('cors');
const fetch = require('superagent');
// const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
// const handleError = require('./utils.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with '/api' below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

//Bootstrap code
// app.get('/animals', async(req, res) => {
//   try {
//     const data = await client.query('SELECT * from animals');
    
//     res.json(data.rows);
//   } catch(e) {
    
//     res.status(500).json({ error: e.message });
//   }
// });

app.get('/location', async(req, res) => {
  //This route needs to query LocationQIAPI and return data in the format below with what the user entered in cityexplorer-FE.
  const locationLatLon = await fetch.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.LocationIQ}&q=${req.query.search}&format=json`);

  try {
    const data = {
      'formatted_query': locationLatLon.body[0].display_name,
      'latitude': locationLatLon.body[0].lat,
      'longitude': locationLatLon.body[0].lon
    };
    
    res.json(data);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});


app.get('/weather', async(req, res) => {
  //This route needs to query LocationQIAPI and return data in the format below with what the user entered in cityexplorer-FE.
  const weather = await fetch.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WeatherBITAPI}&lat=${req.query.latitude}&lon=${req.query.longitude}&days=8`);
  
  const weatherArray = [];
  const exampleObject = {
    forecast: 'Sunny',
    time: '2020-11-10'
  };

  weather.body.data.map(item => {
    const singleDay = Object.create(exampleObject);
    singleDay.forecast = item.weather.description;
    singleDay.time = item.valid_date;
    weatherArray.push(singleDay);
  });

  try {
    const data = weatherArray;
    
    res.json(data);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/reviews', async(req, res) => {
  
  const yelp = await fetch.get(`https://api.yelp.com/v3/businesses/search?latitude=${req.query.latitude}&longitude=${req.query.longitude}&limit=20&term=restaurant`)
    .set({ 
      Authorization: `Bearer ${process.env.Yelp}`
    });

  const yelpArray = [];
  const exampleObject = {
    name: 'Pike Place Chowder',
    image_url: 'https://s3-media3.fl.yelpcdn.com/bphoto/ijju-wYoRAxWjHPTCxyQGQ/o.jpg',
    price: '$$',
    rating: '4.5',
    url: 'https://www.yelp.com/biz/pike-place-chowder-seattle?adjust_creative=uK0rfzqjBmWNj6-d3ujNVA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=uK0rfzqjBmWNj6-d3ujNVA'
  };

  yelp.body.businesses.map(item => {
    const singleYelp = Object.create(exampleObject);
    singleYelp.name = item.name;
    singleYelp.image_url = item.image_url;
    singleYelp.price = item.price;
    singleYelp.rating = item.rating;
    singleYelp.url = item.url;
    yelpArray.push(singleYelp);
  });

  try {
    const data = yelpArray;
    
    res.json(data);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
