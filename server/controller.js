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
  .then(() => {
    res.send('Subscription added.');
  })
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
  var subscriptions = [];
  podcasts.forEach((podcast) => {
    console.log('Evaluating subscribed podcast: ', podcast.name);
    subscriptions.push(podcast.name);
    // promises.push(addPodcast(podcast));
    promises.push(getContentAndGenres(podcast).then((words) => {
      genres = genres.concat(words.genres);
      content = content.concat(words.content);
    }));
  })
  Promise.all(promises).then(() => {
    console.log('Genres: ', genres);
    console.log(' Content: ', content);
    genres = getWordCount('genre', genres);
    content = getWordCount('content', content);

    console.log('TOP GENRES: ', genres);
    console.log('TOP CONTENT: ', content);

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
    promises.length = 0;
    topGenres.forEach((genre) => {
      promises.push(Genre.find({genre: genre})
      .then((records) => {
        records.forEach((record) => {
          recommended = recommended.concat(record.podcasts);
        })
      }));
    })
    topContent.forEach((content) => {
      promises.push(Content.find({content: content})
      .then((records) => {
        records.forEach((record) => {
          recommended = recommended.concat(record.podcasts);
        })
      }));
    })
    return Promise.all(promises)
  })
  .then(() => {
    recommended = _.uniq(recommended);
    promises.length = 0;
    promises = recommended.map((id, i) => {
      return Podcast.find({podcastId: id}).then((record) => {
        recommended[i] = record[0].podcastObj
      });
    });
    return Promise.all(promises)
  })
  .then(() => {
    recommended =_.filter(recommended, (r) => {
      var keep = true;
      subscriptions.forEach((sub) => {
        if (r.collectionName === sub){
          keep = false;
          console.log('Removing ', sub);
        }
      });
      return keep;
    })
    console.log('Recommended (first 2/20):', recommended.slice(0,2));
    res.send(recommended.slice(0, 20));
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

