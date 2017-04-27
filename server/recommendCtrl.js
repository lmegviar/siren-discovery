var getContentAndGenres = require('../helpers/helpers.js').getContentAndGenres;
var getWordCount        = require('../helpers/helpers.js').getWordCount;
var getHighestKeys      = require('../helpers/helpers.js').getHighestKeys;
var db                  = require('../db/config.js');
var _                   = require('lodash');
var Genre               = db.Genre;
var Podcast             = db.Podcast;
var Genre               = db.Genre;
var Content             = db.Content;

module.exports = function(req, res) {
  var podcasts = req.body;
  var recommended = [];
  var genres = [];
  var content = [];
  var topGenres = [];
  var topContent = [];
  var genreCounts =[];
  var contentCounts = [];
  var subscriptions = [];

  var promises = podcasts.map((podcast) => {
    subscriptions.push(podcast.name);
    console.log('Evaluating subscribed podcast: ', podcast.name);
    return getContentAndGenres(podcast)
    .then((words) => {
      genres = genres.concat(words.genres);
      content = content.concat(words.content);
    });
  })
  Promise.all(promises).then(() => {
    genres = getWordCount('genre', genres);
    content = getWordCount('content', content);
    topGenres = getHighestKeys(genres);
    topContent = getHighestKeys(content);
    Object.keys(topGenres).forEach((key, i) => {
      if ((topGenres[key] === 1 && subscriptions.length > 3) || key === 'Podcasts') {
        topGenres.splice(i, 1);
      }
      delete genres[key];
    })
    Object.keys(topContent).forEach((key) => {
      if (topContent[key] === 1 && subscriptions.length > 3) {
        topContent.splice(i, 1);
      }
      delete content[key];
    })
    console.log('TOP GENRES: ', topGenres);
    console.log('TOP CONTENT: ', topContent);
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
        }
      });
      return keep;
    })
    res.send(recommended.slice(0, 20));
  })
  .catch((err) => console.log(err));
};