const express = require('express');
const cors = require('cors');
const fetch = require('superagent');
// const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const { mungLocation, mungWeather, mungReviews, mungTrails } = require('./utils');

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

app.get('/location', async(req, res) => {
  //This route needs to query LocationQIAPI and return data in the format below with what the user entered in cityexplorer-FE.
  const locationLatLon = await fetch.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.LocationIQ}&q=${req.query.search}&format=json`);
  const data = mungLocation(locationLatLon);
  try {
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});


app.get('/weather', async(req, res) => {
  //This route needs to query LocationQIAPI and return data in the format below with what the user entered in cityexplorer-FE.
  const weather = await fetch.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WeatherBITAPI}&lat=${req.query.latitude}&lon=${req.query.longitude}&days=8`);
  const weatherArray = mungWeather(weather);
  console.log(weather.body.data);
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
  const yelpArray = mungReviews(yelp);

  try {
    const data = yelpArray;
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});


app.get('/trails', async(req, res) => {
  const trails = await fetch.get(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=10&key=${process.env.HikingAPI}`);
  const trailArray = mungTrails(trails);

  try {
    const data = trailArray;
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;
