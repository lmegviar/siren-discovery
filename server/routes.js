var subscribeCtrl = require('./subscribeCtrl');
var recommendCtrl = require('./recommendCtrl');
var addCtrl = require('./addCtrl');
var express = require('express')

module.exports = function (app, express) {
  app.post('/api/recommend', recommendCtrl);
  app.post('/api/subscribe', subscribeCtrl);
  app.post('/api/addPodcasts', addCtrl);
};