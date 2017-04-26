var mongoose = require('mongoose');
var Podcast = require('./config.js').Podcast;
var Genre = require('./config.js').Genre;
var Content = require('./config.js').Content;

// mongoose.connect('mongodb://127.0.0.1/discovery');
mongoose.connect('mongodb://heroku_dg5mdmtc:rtcuj68jlij7kg61ph6dn1pdkg@ds117251.mlab.com:17251/heroku_dg5mdmtc');

// CONNECT DATABASE
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Discovery database is connected!')
});

module.exports = db;


// To seed db:
// mongoimport --db discovery --collection words --drop --file db/seeders/words.json
// mongoimport --db discovery --collection users --drop --file db/seeders/users.json
// mongoimport --db discovery --collection podcasts --drop --file db/seeders/podcasts