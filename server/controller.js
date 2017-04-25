var db                  = require('../db/config.js');
var Podcast             = db.Podcast;
var Genre               = db.Genre;
var Content             = db.Content;
var request             = require('request');
var parsePodcast        = require('../helpers/node-podcast-parser');
var saveDescriptions    = require('../helpers/helpers.js').saveDescriptions;
var addPodcast          = require('../helpers/helpers.js').addPodcast;
var getContent          = require('../helpers/helpers.js').getContent;
var addWords            = require('../helpers/helpers.js').addWords;
var getContentAndGenres = require('../helpers/helpers.js').getContentAndGenres;
var getWordCount        = require('../helpers/helpers.js').getWordCount;
var getHighestKeys      = require('../helpers/helpers.js').getHighestKeys;
var _                   = require('lodash');

exports.addSubscription = function(req, res) {
  console.log('Subscription added.');
  var podcast = req.body
  addPodcast(podcast)
  .catch((err) => console.log(err));
};

exports.getRecommendations = function(req, res) {
  var podcasts = req.body;
  var recommended = [];
  var genres = [];
  var content = [];
  var topGenres = [];
  var topContent = [];
  var genreCounts =[];
  var contentCounts = [];
  var promises = [];
  podcasts.forEach((podcast) => {
    promises.push(addPodcast(podcast));
    promises.push(getContentAndGenres(podcast).then((words) => {
      genres = genres.concat(words.genres);
      content = content.concat(words.content);
    }));
  })
  Promise.all(promises).then(() => {
    genres = getWordCount('genre', genres);
    content = getWordCount('content', content);
    for (var i = 0; i < 1; i++) {
      topGenres = getHighestKeys(genres);
      topContent = getHighestKeys(content);
      Object.keys(topGenres).forEach((key) => {
        delete genres[key];
      })
      Object.keys(topContent).forEach((key) => {
        delete content[key];
      })
    }
    console.log('Top Genres/Content', topGenres, topContent);
    promises.length = 0;
    topGenres.forEach((genre) => {
      promises.push(Genre.find({genre: genre})
      .then((records) => {
        console.log('Genre record: ', records);
        records.forEach((record) => {
          recommended = recommended.concat(record.podcasts);
        })
      }));
    })
    topContent.forEach((content) => {
      promises.push(Content.find({content: content})
      .then((records) => {
        records.forEach((record) => {
          console.log('Content record: ', record);
          recommended = recommended.concat(record.podcasts);
        })
      }));
    })
    return Promise.all(promises)
  })
  .then(() => {
    recommended = _.uniq(recommended);
    promises.length = 0;
    console.log('Recommended', recommended);
    promises = recommended.map((id, i) => {
      return Podcast.find({podcastId: id}).then((record) => {
        console.log('Record: ', record[0]);
        console.log('Record.podcastObj', record[0].podcastObj);
        recommended[i] = record[0].podcastObj
      });
    });
    return Promise.all(promises)
  })
  .then(() => {
    res.send(recommended);
  })
  .catch((err) => console.log(err));

};

//Include ?term=<querystring> with request
exports.addPodcasts = function(req, res) {
  var query = req.query.term;
  request(('https://itunes.apple.com/search?entity=podcast&term=' + query), function (error, response, body) {
    console.log('statusCode:', response && response.statusCode);
    JSON.parse(body).results.forEach((podcast) => {
      addPodcast(podcast)
      .then(() => {
        res.send('addPodcasts complete');
      })
      .catch((err) => res.send(err));
    });
  });
};

exports.excludeRecommendation = function(req, res) {
  //Complete if time allows
};

