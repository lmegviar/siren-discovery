var mongoose = require('mongoose');
var db = require('./db');
var Schema = mongoose.Schema;

var podcastsSchema = Schema({
  podcastObj: Schema.Types.Mixed,
  name: String,
  podcastId: Number,
  description: String,
  content: [String],
  genres: [String]
});

var genresSchema = Schema({
  genre: String,
  podcasts: [Number]
});

var contentSchema = Schema({
  content: String,
  podcasts: [Number]
});

exports.Podcast = mongoose.model('Podcasts', podcastsSchema);
exports.Genre = mongoose.model('Genres', genresSchema);
exports.Content = mongoose.model('Content', contentSchema);
