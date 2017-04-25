var mongoose = require('mongoose');
var db = require('./db');
var Schema = mongoose.Schema;
// SCHEMAS----------------------------------------------------
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

// MODELS--------------------------------------------------
exports.Podcast = mongoose.model('Podcasts', podcastsSchema);
exports.Genre = mongoose.model('Genres', genresSchema);
exports.Content = mongoose.model('Content', contentSchema);

//NOTES----------------------------------------------------
//Mixed type objects:
// person.anything = { x: [3, 4, { y: "changed" }] };
// person.markModified('anything');
// person.save(); // anything will now get saved