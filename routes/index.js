var express = require('express');
var router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

/* GET home page. */
router.get('/', (req, res, next) => {
  
  res.render('index.hbs');
  
});


router.get('/artist-search', (req, res, next) => {

  spotifyApi
  .searchArtists(req.query.artistSearch)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0].images);
    let results = data.body.artists.items
    
    res.render('artist-search-results.hbs', {results} )
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));


})

router.get('/albums/:id', (req, res, next) => {

  spotifyApi
  .getArtistAlbums(req.params.id)
  .then((results) => {
    console.log("these are albums", results.body.items) 
    let albums = results.body.items
    res.render('albums.hbs', {albums})
  })
  .catch((err) => {
    console.log(err)
  })

})

router.get('/albumTracks/:id', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then((results) => {
    console.log("these are TRACKS ", results.body) 
    let tracks = results.body.items
    res.render('tracks.hbs', {tracks})
  })
  .catch((err) => {
    console.log(err)
  })
})



module.exports = router;
