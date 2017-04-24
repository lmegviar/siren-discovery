var mongoose = require('mongoose');
var db = require('./db');
var Schema = mongoose.Schema;
// SCHEMAS----------------------------------------------------
var usersSchema = Schema({
  username: { type: String, required: true, index: { unique: true } },
  podcasts: [Number],
  genres: Schema.Types.Mixed,
  content: Schema.Types.Mixed
});

var podcastsSchema = Schema({
  // collectionId: {type: Number, required: true, index: {unique: true} },
  // collectionName: {type: String},
  // artistId: {type: String},
  // artistName: {type: String},
  // feedUrl: {type: String},
  // primaryGenreName: {type: String},
  // artworkUrl100: {type: String},
  // artwrokUrl600: {type: String},
  podcastObj: Schema.Types.Mixed,
  description: String,
  content: [String],
  genres: [String]
});

var wordsSchema = Schema({
  content: Schema.Types.Mixed,
  genres: Schema.Types.Mixed
});

// MODELS--------------------------------------------------
exports.Users = mongoose.model('Users', usersSchema);
exports.Podcasts = mongoose.model('Podcasts', podcastsSchema);
exports.Words = mongoose.model('Words', wordsSchema);

//NOTES----------------------------------------------------
//Mixed type objects:
// person.anything = { x: [3, 4, { y: "changed" }] };
// person.markModified('anything');
// person.save(); // anything will now get saved