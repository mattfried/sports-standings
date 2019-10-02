// MySportsFeeds API data request
// https://github.com/MySportsFeeds/mysportsfeeds-node
const config = require('../config.js');
const MySportsFeeds = require('mysportsfeeds-node');
const msf = new MySportsFeeds('2.0', true);

msf.authenticate(config.msf_vars.api_key, 'MYSPORTSFEEDS');

// Get NHL data from MySportsFeeds API and export for use in index.js
exports.getData_nhl = () => {
  return msf.getData('nhl', '2019-2020-regular', 'seasonal_standings', 'json', {
    force: true
  });
};

// Get NBA data from MySportsFeeds API and export for use in index.js
exports.getData_nba = () => {
  return msf.getData('nba', '2018-2019-regular', 'seasonal_standings', 'json', {
    force: true
  });
};

// Get NFL data from MySportsFeeds API and export for use in index.js
exports.getData_nfl = () => {
  return msf.getData('nfl', '2019-regular', 'seasonal_standings', 'json', {
    force: true
  });
};

// Get MLB data from MySportsFeeds API and export for use in index.js
exports.getData_mlb = () => {
  return msf.getData('mlb', '2019-regular', 'seasonal_standings', 'json', {
    force: true
  });
};
