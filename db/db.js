var mongoose = require('mongoose');
var Podcast = require('./config.js').Podcast;
var Genre = require('./config.js').Genre;
var Content = require('./config.js').Content;
//address from Heroku
mongoose.connect('mongodb://127.0.0.1/discovery');

//Replace with mongoose db link in production: (ex: mongodb://heroku_3j87rzvb:1q53elhgre7kevlup0jfmm8anu@ds129600.mlab.com:29600/heroku_3j87rzvb)

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