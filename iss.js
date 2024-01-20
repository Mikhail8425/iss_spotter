/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    const myIP = JSON.parse(body).ip;
    callback(null, myIP);
  })
}

const fetchCoordsByIP = (ip, callback) => {
  request.get(`https://freegeoip.app/json/${ip}`, (err, response, body) => {
    // If error, print it out
    if (err) {
      callback(err, null);
    } else if (response.statusCode !== 200) {
      // If there was a non-success response code, log it and throw an error
      const responseCodeError = handleStatusCode(response.statusCode, "fetching coordinates", body);
      callback(responseCodeError, null);
    } else {
      //Otherwise we should have coordinates! We only want lat and long.
      const { latitude, longitude } = JSON.parse(body);
      callback(null, { latitude, longitude });
    }
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };

