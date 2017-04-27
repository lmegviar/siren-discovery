# siren-discovery
## Podcast Recommendation Engine
Provides recommendations from a subset of podcasts. Suggestions formulated based on related genres and 
content analysis of podcasts' titles and descriptions using IBM Watson.  



### Getting Started

Fork the repositiory and run npm install on your machine to add dependencies.
Run npm install mongodb



### Accessing the API

Connect to your local version of the project by replacing heroku url with localhost:3000



#### Get Recommenations

GET to http://siren-discovery.herokuapp.com/api/recommend

Request format: {name: [FULL NAME OF PODCAST AS FOUND ON iTUNES]}

Response format: Array of iTunes podcast objects (as returned from requests to [I'm an inline-style link with title](https://itunes.apple.com/search "iTunes search"))



#### Add a podcast to the database

All podcasts included with a request for recommendations must first be added/analyzed via this route.

POST to http://localhost:3000/api/subscribe

Request format: iTunes podcast objects 



#### Bulk add podcasts to the database

POST to https://siren-discovery.herokuapp.com/api/addPodcasts?term=[YOUR QUERY]

Replace your query with a query string used to search iTunes.



