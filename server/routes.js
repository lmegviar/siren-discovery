var controller = require('./controller.js');
var express = require('express')

module.exports = function (app, express) {
  app.post('/api/recommend', controller.getRecommendations);
  app.post('/api/subscribe', controller.addSubscription);
  app.post('/api/addPodcasts', controller.addPodcasts);
  app.put('/api/exclude', controller.excludeRecommendation);
};