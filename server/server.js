var express = require('express');
var db = require('../db/db.js');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

require('./routes.js')(app, express);

app.listen(process.env.PORT || 3000, function () {
  console.log('Siren Discovery server up and running!');
});

module.exports = app;

