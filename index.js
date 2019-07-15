const express = require('express');

const scraper = require('./scraper');
const app = express();

// const corsOptions = {
//   origin: "*", // Or pass origins you want
//   credentials: true
// };
const cors = require('cors');
app.use(cors());


const db = require('./db');

app.get('/', (req, res) => {
  res.json({
    msg: 'Cannot wait to scrape'
  });
});

app.get('/search/:title', (req, res) => {
  scraper
    .searchMovies(req.params.title)
    .then(movies => {
      res.json(movies);
    });
});

app.get('/movie/:imdbID', (req, res) => {
  scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
      res.json(movie);
    });
  });

const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

