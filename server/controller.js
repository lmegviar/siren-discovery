var db                  = require('../db/config.js');
var Podcast             = db.Podcast;
var Genre               = db.Word;
var request             = require('request');
var parsePodcast        = require('../helpers/node-podcast-parser');
var saveDescriptions    = require('../helpers/helpers.js').saveDescriptions;
var addPodcast          = require('../helpers/helpers.js').addPodcast;
var getContent          = require('../helpers/helpers.js').getContent;
var addWords            = require('../helpers/helpers.js').addWords;
var getContentAndGenres = require('../helpers/helpers.js').getContentAndGenres;
var getWordCount        = require('../helpers/helpers.js').getWordCount;
var _                   = require('lodash');

exports.addSubscription = function(req, res) {
  console.log('Subscription added.');
  var podcast = req.body
  addPodcast(podcast);
};

exports.getRecommendations = function(req, res) {
  var podcasts = req.body;
  var recommended = [];
  var genres = [];
  var content = [];
  podcasts.forEach((podcast) => {
    getContentAndGenres(podcast).then((words) => {
      genres = genres.concat(words.genres);
      content = content.concat(words.content);
    });
  })
        genres = getWordCount('genre', genres);
      content = getWordCount('content', content);
      console.log('Get Recommendations: Genres =>', genres, ' Content =>', content);
};

//Include ?term=<querystring> with request
exports.addPodcasts = function(req, res) {
  var query = req.query.term;
  request(('https://itunes.apple.com/search?entity=podcast&term=' + query), function (error, response, body) {
    console.log('statusCode:', response && response.statusCode);
    JSON.parse(body).results.forEach((podcast) => {
      addPodcast(podcast);
    });
  });
};

exports.excludeRecommendation = function(req, res) {
  //Complete if time allows
};


// SUBSCRIPTIONS OBJ:

// Subscriptions[0]:  [

//{"id":42,"artistName":"MouseChat.net Disney Podcast - Hosts: Lisa. Steve, Lauren, Chris, Sharpie","name":"MouseChat.net – Disney News & Reviews","primaryGenreName":"Kids & Family","artworkUrl":"http://is4.mzstatic.com/image/thumb/Music71/v4/9e/47/3c/9e473c08-6451-15b8-1db3-ec82c639de43/source/100x100bb.jpg"},

//{"id":55,"artistName":"The New York Times","name":"The Daily","primaryGenreName":"News & Politics","artworkUrl":"http://is4.mzstatic.com/image/thumb/Music122/v4/1b/83/76/1b8376aa-90a9-eae1-662d-2b24faf1bf6e/source/100x100bb.jpg"},

//{"id":56,"artistName":"BBC World Service","name":"Global News Podcast","primaryGenreName":"News & Politics","artworkUrl":"http://is5.mzstatic.com/image/thumb/Music111/v4/9f/79/39/9f7939d0-5142-b50c-0ca2-f8ef09635180/source/100x100bb.jpg"},

//{"id":57,"artistName":"American Public Media","name":"A Prairie Home Companion: News from Lake Wobegon","primaryGenreName":"Comedy","artworkUrl":"http://is1.mzstatic.com/image/thumb/Music122/v4/1a/fd/80/1afd802d-08d6-2878-ffb3-d9ff04df0223/source/100x100bb.jpg"},

//{"id":72,"artistName":"NBC News","name":"NBC Meet the Press (audio)","primaryGenreName":"News & Politics","artworkUrl":"http://is2.mzstatic.com/image/thumb/Music71/v4/06/36/b1/0636b13f-7027-3dc5-cb01-92ff39473f7d/source/100x100bb.jpg"}

//]
