var mongoose = require('mongoose');
var Podcast = require('./config.js').Podcast;
var Genre = require('./config.js').Genre;
var Content = require('./config.js').Content;
var config = require('../config.json');

var mongoURL = process.env.MONGODB_URI || config.localDB;
mongoose.connect(mongoURL);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Discovery database is connected!')
});

module.exports = db;
