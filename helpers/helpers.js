const chalk         = require('chalk');
const parsePodcast  = require('./node-podcast-parser');
const request       = require('request');


module.exports = {
  getFeed: function (req, res) {
    request(req.query.url, (err, response, data) => {
      if (err) {
        console.error('Network error', err);
        return;
      }
      parsePodcast(data, (err, podcast) => {
        if (err) {
          console.error('Parsing error', err);
          return;
        }
        delete podcast.episodes;
        console.log(chalk.yellow(podcast));
        res.status(200).send(podcast);
      });
    });
  }
}