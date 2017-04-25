const chalk         = require('chalk');
var db = require('../db/config.js');
var Podcast = db.Podcast;
var Genre = db.Genre;
var Content = db.Content;
var request = require('request');
var parsePodcast = require('./node-podcast-parser');
var _ = require('lodash');

var getFeed = function (req, res) {
  request(req.query.url, (err, response, data) => {
    if (err) {
      console.error('Network error', err);
      return;
    }
    parsePodcast(data, (err, podcast) => {
      if (err) {
        console.error('Parsing error', err);
        return;
      }
      delete podcast.episodes;
      console.log(chalk.yellow(podcast));
      res.status(200).send(podcast);
    });
  });
};

var saveDescriptions = function (url, id) {
  var description = '';
  return new Promise((resolve, reject) => {
    request(url, (err, response, data) => {
      if (err) {
        console.error('Network error', err);
        reject(err);
      }
     parsePodcast(data, (err, feed) => {
      if (err) {
        console.error('Parsing error', err);
        return;
      }
      description = (feed.title + ' ' + feed.description.long);
      Podcast.findOne({_id: id}, (err, podcast) => {
        podcast.description = description;
        podcast.save();
      })
      resolve({description: description, id: id});
    });
    })
  })
};

var getContentAndGenres = function (podcast) {
 return new Promise ((resolve, reject) => {
    var genres = [];
    var content= [];
    Podcast.findOne({name: podcast.name}, (err, record) => {
      if (err) reject (err);
      genres = genres.concat(record.genres);
      content = content.concat(record.content);
      resolve({genres: genres, content: content});
    })
  })
};

var addWords = function (podcast) {
  podcast.genres.forEach((genre) => {
   Genre.findOne({genre: genre}, (err, record) => {
      if (err) handleError(err);
      if (!record) {
        var newRecord = new Genre({genre: genre, podcasts: [podcast.podcastId]});
        console.log('New genre record created for ' + genre + '!');
        newRecord.save((err) => {if (err) handleError(err);})
      } else {
        record.podcasts = record.podcasts.push(podcast.podcastId);
        record.podcasts = _.uniq(record.podcasts);
        record.save();
      }
    })
  });
  podcast.content.forEach((contentWord) => {
   Content.findOne({content: contentWord}, (err, record) => {
      if (err) handleError(err);
      if (!record) {
        var newRecord = new Content({content: contentWord, podcasts: [podcast.podcastId]});
        console.log('New content record created for ' + contentWord + '!');
        newRecord.save((err) => {if (err) handleError(err);})
      } else {
        record.podcasts = record.podcasts.push(podcast.podcastId);
        record.podcasts = _.uniq(record.podcasts);
        record.save();
      }
    })
  })
};

var getWordCount = function (type, array) {
  if (type = 'genre') {
    genres = {};
    array.forEach((genre) => {
      if (genre in genres) {
        genres[genre]++;
      } else {
        genres[genre] = 1;
      }
    });
    return genres;
  } else if (type = 'content') {
    content = {};
    array.forEach((word) => {
      if (word in content) {
        content[word]++;
      } else {
        content[word] = 1;
      }
    });
    return content;
  }
}

var getContent = function (id, description) {
  var username = '4de54bed-d64c-48d2-9c11-5aa6fafdfb11';
  var password = 'jeuLeIlI6Bqi';
  console.log('Making call to Watson');
  var url = 'https://' + username + ':' + password + '@gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2017-02-27';
  var body =  { text: description, features: { "concepts": { "limit": 10 } } }
  var options = {
    method: 'POST',
    json: true,
    url: url,
    headers: {
      'content-type': 'application/json'
    },
    body: body
  }
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
        if (error) {
          console.log('getContent Error: ', error);
          reject(error);
        }
        var concepts = [];
        response.body.concepts.forEach((concept) => {
          if (concept.relevance > 0.6) {
            concepts.push(concept.text);
          }
        });
        resolve(concepts);
    })
  })
};

var addPodcast = function (podcast) {
  var id = null;
  var content = [];
  var podcastRecord = null;
  var genres = podcast.genres;
  var content = [];
  delete podcast.genres;
  Podcast.findOne({podcastId: podcast.collectionId}, (err, record) => {
    if (err) handleError(err);
    if (!record) {
      var newRecord = new Podcast({podcastObj: podcast, podcastId: podcast.collectionId, genres: genres, content: []});
      newRecord.save((err) => {if (err) handleError(err); id = newRecord._id;})
      .then (() => {
        Podcast.findOne({_id: id})
        .then((record) => {
          podcastRecord = record;
        })
        .then(() => {
          var url = podcastRecord.podcastObj.feedUrl;
          return saveDescriptions(url, podcastRecord._id)
        })
        .then((data) => {
          return getContent(data.id, data.description);
        })
        .then((concepts) => {
          if (concepts) {
            content = content.concat(concepts);
            content = _.uniq(content);
            Podcast.findOne({_id: id}, (err, podcast) => {
              podcastRecord = podcast;
              podcast.content = content;
              podcast.save();
            })
            .then(() => {
              addWords(podcastRecord);
            })
          }
        })
      })
      .catch((err) => console.log(err));
    } else {
      console.log('Record already in database.');
    }
  })
};

module.exports = {
  getFeed: getFeed,
  addPodcast: addPodcast,
  getContent: getContent,
  addWords: addWords,
  getContentAndGenres: getContentAndGenres,
  saveDescriptions: saveDescriptions,
  getWordCount: getWordCount
}