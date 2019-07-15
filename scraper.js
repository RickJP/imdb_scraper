const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const searchUrl = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieUrl = 'https://www.imdb.com/title/';
const movieCache = {};
const searchCache = {};

var request = require('request');
const movieSearchUrl = 'http://localhost:3000/movie/';

const imdbIDs = ['tt0111161', 'tt0068646', 'tt0137523', 'tt1375666'];

function getMovieInfo(id, cb) {
  //console.log(`${movieSearchUrl}${id}`);
  request(`${movieSearchUrl}${id}`, function(err, req, body) {
    movieInfo = req.body;
    return cb(movieInfo);
  });
}

let count = 0;
let moviesInfo = [];

imdbIDs.forEach( (id, idx) => {
  getMovieInfo(id, data => {
    
    count++;
    if (imdbIDs.length === count) {
      data = data.replace(/\,$/,''); 
      console.log(data.slice(-1));
      newData = '[' + data + ']';
      moviesInfo.push(newDat);

      fs.writeFile('movieInfo.json', moviesInfo, 'utf8', () => {
        console.log('Finished Writing');
      });
    } else {
      moviesInfo.push(data);
    }  
    // let existingData = fs.readFileSync('movieInfo.json');
    // let existing = JSON.parse(existingData);
    // existing.append(data);  
  });
});





function searchMovies(searchTerm) {
  if (searchCache[searchTerm]) {
    console.log(searchCache[searchTerm]);
    console.log(`Serving from cache ${searchTerm}`);
    return Promise.resolve(searchCache[searchTerm]);
  }

  console.log(`${searchUrl}${searchTerm}`);
  return fetch(`${searchUrl}${searchTerm}`)
    .then(res => res.text())
    .then(body => {
      const movies = [];
      const $ = cheerio.load(body);
      $('.findResult').each(function(idx, el) {
        const $element = $(el);
        const $image = $(el).find('td a img');
        const $title = $(el).find('td.result_text a');
        const href = $title.attr('href').match(/title\/(.*)\//)[1];
        const movie = {
          title: $title.text(),
          image: $image.attr('src'),
          imdbID: href,
        };
        movies.push(movie);
      });

      searchCache[searchTerm] = movies;
      return movies;
    });
}

function getCreators($, pos) {
  const creators = [];

  let anchorEl = 'a';
  if (pos === 4) {
    anchorEl = 'a:not(:last-child)';
  }
  $(`div.credit_summary_item:nth-child(${pos}) ${anchorEl}`).each((idx, el) => {
    const creator = $(el).text();
    creators.push(creator);
  });
  return creators;
}

function getMovie(imdbID) {
  if (movieCache[imdbID]) {
    console.log(movieCache[imdbID]);
    console.log(`Serving from cache ${imdbID}`);
    return Promise.resolve(movieCache[imdbID]);
  }

  return fetch(`${movieUrl}${imdbID}`)
    .then(res => res.text())
    .then(body => {
      const $ = cheerio.load(body);
      const $title = $('.title_wrapper h1');
      const title = $title
        .first()
        .contents()
        .filter(function() {
          return this.type === 'text';
        })
        .text()
        .trim();
      const userScore = $('span[itemprop="ratingValue"]').text();
      const $subtext = $('div[class="subtext"]');
      const contentRating = $subtext
        .first()
        .contents()
        .filter(function() {
          return this.type === 'text';
        })
        .text()
        .replace(/\s|,/g, '');

      const runTime = $('time[datetime*="PT"]')
        .text()
        .trim()
        .split('\n')[0];
      const year = $('span[id="titleYear"]')
        .text()
        .replace(/\(|\)/g, '');
      const datePublished = $subtext
        .children('a:last-child')
        .text()
        .trim();

      const poster = $('div .poster a img').attr('src');
      const summary = $('div.summary_text')
        .text()
        .trim();

      const genres = [];
      $subtext.children('a:not(:last-child)').each((idx, el) => {
        const genre = $(el).text();
        genres.push(genre);
      });

      const directors = getCreators($, 2);
      const writers = getCreators($, 3);
      const stars = getCreators($, 4);
      const storyline = $('div#titleStoryLine div p span')
        .text()
        .trim();
      const budget = $('.txt-block h4:contains("Budget:")')
        .parent()
        .contents()
        .eq(2)
        .text()
        .trim();

      const trailer =
        'https://www.imdb.com' + $('div[class="slate"] a').attr('href');

      const movie = {
        imdbID,
        title,
        year,
        directors,
        writers,
        stars,
        contentRating,
        runTime,
        genres,
        userScore,
        datePublished,
        poster,
        summary,
        storyline,
        budget,
        trailer,
      };
      movieCache[imdbID] = movie;
      return movie;
    });
}

module.exports = {
  searchMovies,
  getMovie,
};
