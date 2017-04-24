var mongoose = require('mongoose');
var Record = require('./config.js');
//address from Heroku
mongoose.connect('mongodb://localhost:27017/discovery');

//Replace with mongoose db link in production: (ex: mongodb://heroku_3j87rzvb:1q53elhgre7kevlup0jfmm8anu@ds129600.mlab.com:29600/heroku_3j87rzvb)

// CONNECT DATABASE
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Discovery database is connected!')
});

module.exports = db;


//create DemoData:
//   var demoRecord = new Record ({
//       })

//   demoRecord.save(function(err, newRecord) {
//     if (err) {
//       console.error('Error: ', err);
//     } else {
//       console.log('Demo record created!');
//     }
//   })
// });