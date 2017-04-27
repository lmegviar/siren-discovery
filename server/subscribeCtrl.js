var addPodcast = require('../helpers/helpers.js').addPodcast;

module.exports = function(req, res) {
  var podcast = req.body
  addPodcast(podcast)
  .then(() => res.send('Subscription added.'))
  .catch(console.log);
  console.log('Subscription added.');
};
