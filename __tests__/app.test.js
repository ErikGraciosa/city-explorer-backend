require('dotenv').config();
const { mungLocation,
  mungWeather,
  mungReviews,
  mungTrails 
} = require('../lib/utils');


describe('app routes', () => {
  describe('routes', () => {
    // let token;
  

    test('Confirm location munging function returns munged object based on contract from API', async() => {

      const dataSample = {
        body: [
          {
            place_id: '230954315',
            licence: 'https://locationiq.com/attribution',
            osm_type: 'relation',
            osm_id: '186203',
            boundingbox: [Array],
            lat: '46.187885',
            lon: '-123.831256',
            display_name: 'Astoria, Clatsop County, Oregon, USA',
            class: 'boundary',
            type: 'administrative',
            importance: 0.69563140538597,
            icon: 'https://locationiq.org/static/images/mapicons/poi_boundary_administrative.p.20.png'
          }
        ]
      };

      const expectation = [
        'formatted_query',
        'latitude',
        'longitude'
      ];

      const actual = mungLocation(dataSample);

      expect(Object.keys(actual)).toEqual(expectation);
    });


    test('Confirm weather munging function returns munged object based on contract from API', async() => {

      const dataSample = {
        body: {
          data: [
            {
              moonrise_ts: 1605455445,
              wind_cdir: 'SW',
              rh: 91,
              pres: 1015.49,
              high_temp: 10.9,
              sunset_ts: 1605487789,
              ozone: 281.125,
              moon_phase: 0.0509325,
              wind_gust_spd: 12,
              snow_depth: 0,
              clouds: 64,
              ts: 1605427260,
              sunrise_ts: 1605453493,
              app_min_temp: 10.4,
              wind_spd: 3.94008,
              pop: 15,
              wind_cdir_full: 'southwest',
              slp: 1018.15,
              moon_phase_lunation: 0.03,
              valid_date: '2020-11-15',
              app_max_temp: 12.1,
              vis: 23.4462,
              dewpt: 9.5,
              snow: 0,
              uv: 1.97097,
              weather:  { icon: 'c02d', code: 802, description: 'Scattered clouds' },
              wind_dir: 216,
              max_dhi: null,
              clouds_hi: 44,
              precip: 0.1875,
              low_temp: 9,
              max_temp: 12.2,
              moonset_ts: 1605492792,
              datetime: '2020-11-15',
              temp: 11.1,
              min_temp: 10.4,
              clouds_mid: 39,
              clouds_low: 43
            }
          ]
        }
      };

      const expectation = [
        'forecast', 'time'
      ];

      const actual = mungWeather(dataSample);
      expect(Object.keys(actual[0])).toEqual(expectation);
    });

    test('Confirm reviews munging function returns munged object based on contract from API', async() => {

      const dataSample = {
        body: {
          businesses: [
            {
              id: 'Imrene35d-aV_jxFQNW0hw',
              alias: 'south-bay-wild-fish-house-astoria',
              name: 'South Bay Wild Fish House',
              image_url: 'https://s3-media3.fl.yelpcdn.com/bphoto/-nVL83lLsMvOzyI0OwxH7A/o.jpg',
              is_closed: false,
              url: 'https://www.yelp.com/biz/south-bay-wild-fish-house-astoria?adjust_creative=x7LNmzsX6vivMPeItMemGw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=x7LNmzsX6vivMPeItMemGw',
              review_count: 218,
              categories: [Array],
              rating: 4.5,
              coordinates: [Object],
              transactions: [],
              price: '$$',
              location: [Object],
              phone: '+15037413000',
              display_phone: '(503) 741-3000',
              distance: 229.8904361987794
            }
          ]
        }
      };

      const expectation = [
        'name', 'image_url', 'price', 'rating', 'url'
      ];

      const actual = mungReviews(dataSample);
      expect(Object.keys(actual[0])).toEqual(expectation);
    });


    test('Confirm trails munging function returns munged object based on contract from API', async() => {

      const dataSample = {
        body: {
          trails: [
            {
              id: 7056783,
              name: 'Fort Clatsop Trail',
              type: 'Trail',
              summary: 'A short trail from the Fort Clatsop Visitor Center to the reconstructed fort.',
              difficulty: 'green',
              stars: 3,
              starVotes: 1,
              location: 'Warrenton, Oregon',
              url: 'https://www.hikingproject.com/trail/7056783/fort-clatsop-trail',
              imgSqSmall: 'https://cdn2.apstatic.com/photos/hike/7052306_sqsmall_1555695103.jpg',
              imgSmall: 'https://cdn2.apstatic.com/photos/hike/7052306_small_1555695103.jpg',
              imgSmallMed: 'https://cdn2.apstatic.com/photos/hike/7052306_smallMed_1555695103.jpg',
              imgMedium: 'https://cdn2.apstatic.com/photos/hike/7052306_medium_1555695103.jpg',
              length: 0.2,
              ascent: 0,
              descent: -33,
              high: 47,
              low: 14,
              longitude: -123.8803,
              latitude: 46.1342,
              conditionStatus: 'Unknown',
              conditionDetails: null,
              conditionDate: '1970-01-01 00:00:00'
            }
          ]
        }
      };

      const expectation = [
        'name', 'location', 'length', 'stars', 'star_votes', 'summary', 'trail_url', 'conditions', 'condition_date', 'condition_time'
      ];

      const actual = mungTrails(dataSample);
      expect(Object.keys(actual[0])).toEqual(expectation);
    });


  });
});
