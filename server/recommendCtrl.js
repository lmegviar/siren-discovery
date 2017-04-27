var getContentAndGenres = require('../helpers/helpers.js').getContentAndGenres;
var getWordCount        = require('../helpers/helpers.js').getWordCount;
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

    console.log('All genres: ', genres);
    console.log('All content: ', content);
    Object.keys(genres).forEach((key, i) => {
      if (genres[key] > 1 && key !== 'Podcasts') {
        topGenres.push(key);
      }
    })
    topGenres = _.uniq(topGenres);
    topContent = _.uniq(topContent);
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
    res.send(recommended.slice(0, 12));
  })
  .catch((err) => console.log(err));
};