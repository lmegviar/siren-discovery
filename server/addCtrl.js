var config = require('../config.json');
var request = require('request');
var addPodcast = require('../helpers/helpers.js').addPodcast;

//Include ?term=<querystring> with request
module.exports = function(req, res) {
  var query = req.query.term;
  request(( config.iTunesUrl + query), (error, response, body) => {
    JSON.parse(body).results.forEach((podcast) => {
      addPodcast(podcast)
      .then(() => {
        res.send('addPodcasts complete');
      })
      .catch((err) => res.send(err));
    });
  });
};
