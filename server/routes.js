var controller = require('./controller.js');
var express = require('express')

module.exports = function (app, express) {
  app.get('/api/recommendByUser', controller.getUserRecommendations);
  app.get('/api/recommendByPodcast', controller.getUserRecommendations);
  app.post('/api/subscribe', controller.addSubscription);
  app.post('/api/addPodcasts', controller.addPodcasts);
  app.put('/api/exclude', controller.excludeRecommendation);
};