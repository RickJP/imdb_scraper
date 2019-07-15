const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const searchUrl = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieUrl = 'https://www.imdb.com/title/';
const movieCache = {};
const searchCache = {};
var request = require('request');
const movieSearchUrl = 'http://localhost:3003/movie/';
const imdbIDs = ["tt0111161","tt0068646","tt0071562","tt0468569","tt0050083","tt0108052","tt0167260","tt0110912","tt0060196","tt0137523","tt0120737","tt0109830","tt1375666","tt0080684","tt0167261","tt0073486","tt0099685","tt0133093","tt0047478","tt4154796","tt0114369","tt0317248","tt0076759","tt0102926","tt0038650","tt0118799","tt0245429","tt0120815","tt0114814","tt0110413","tt0120689","tt0816692","tt0054215","tt0120586","tt0021749","tt0034583","tt0064116","tt0253474","tt0027977","tt1675434","tt0407887","tt0088763","tt0103064","tt0110357","tt2582802","tt0047396","tt0172495","tt0082971","tt0482571","tt0078788","tt0209144","tt0078748","tt0095327","tt0095765","tt0032553","tt4633694","tt0043014","tt0405094","tt0057012","tt4154756","tt0050825","tt1853728","tt0081505","tt0910970","tt0119698","tt0051201","tt0364569","tt1345836","tt0090605","tt0169547","tt0087843","tt2380307","tt0082096","tt0033467","tt0112573","tt0052357","tt5311514","tt0053125","tt0105236","tt0086190","tt0086879","tt0022100","tt0180093","tt0114709","tt1187043","tt5074352","tt0062622","tt0986264","tt0338013","tt0056172","tt0066921","tt0045152","tt0361748","tt0211915","tt0036775","tt0075314","tt0093058","tt0119217","tt0040522","tt0056592","tt0012349","tt0070735","tt0435761","tt2106476","tt0208092","tt0086250","tt0059578","tt0053604","tt0017136","tt0071853","tt0119488","tt1832382","tt0097576","tt1049413","tt0042876","tt0042192","tt0372784","tt0053291","tt0055630","tt0363163","tt0095016","tt0105695","tt0113277","tt1255953","tt0040897","tt0044741","tt6966692","tt0081398","tt0057115","tt0118849","tt0457430","tt0071315","tt0096283","tt0347149","tt0089881","tt0041959","tt0055031","tt0476735","tt1305806","tt0015864","tt1979376","tt0268978","tt0050212","tt0112641","tt0120735","tt5027774","tt0050976","tt0047296","tt0993846","tt0080678","tt2096673","tt0434409","tt0031679","tt0469494","tt1291584","tt0477348","tt3170832","tt0083658","tt0046912","tt0167404","tt0050986","tt0117951","tt0017925","tt0031381","tt0084787","tt0116282","tt0091251","tt8108198","tt0266543","tt1205489","tt0077416","tt1130884","tt0118715","tt0266697","tt0015324","tt0061512","tt0978762","tt2119532","tt0107290","tt0046438","tt0032976","tt0892769","tt2267998","tt3011894","tt0120382","tt0079944","tt2278388","tt0107207","tt0092005","tt0353969","tt0018455","tt0025316","tt0091763","tt0758758","tt0074958","tt0060827","tt0052618","tt0079470","tt2024544","tt0405159","tt0112471","tt0395169","tt1392214","tt1392190","tt3315342","tt1028532","tt1979320","tt0116231","tt0046268","tt0264464","tt0053198","tt1895587","tt0245712","tt1201607","tt0060107","tt0087544","tt0019254","tt0093779","tt0169858","tt0072684","tt0075148","tt0064115","tt0405508","tt0198781","tt0097165","tt0032551","tt0088247","tt4016934","tt0033870","tt0113247","tt0083987","tt0118694","tt0246578","tt0107048","tt1454029","tt0032138","tt2015381","tt0046911","tt0073195","tt0381681","tt0092067","tt0325980","tt0101640","tt0101414","tt0087884","tt0070047","tt0072890","tt2758880","tt1865505","tt2338151"];
const GROUPS = Math.round(imdbIDs.length / 20);

// tt00000001 - tt7734218


// function generateIMDBCodes() {
//   let imdbID = [];
//   for (let i = 164368; i < 164450; i++) {
//     imdbID.push('tt' + i.toString().padStart(7, '0'));
//   }
//   console.log('Finished generating IDs.');
//   return imdbID;
// }
// const imdbIDs = generateIMDBCodes();


// function makeIMDBCode(num) { return 'tt' + num.toString().padStart(7, '0'); }

// const sem = require('semaphore')(10);
// function testSem ()
// {
//   imdbIDs.forEach((id) => {  
//     sem.take(function(){
//         console.log(`Sending request to ${movieSearchUrl}${id}`);
//         request(`${movieSearchUrl}${id}`, function(error,response, body) {
//             if (!error && response.statusCode == 200) {
//               theJSON = JSON.parse(body);
//               console.log(theJSON.title);
//             }
//         });
//     });
//   });
// }
// testSem();



function getMovieInfo(FIRST, LAST, cb) {
  // imdbIDs.forEach((id, idx) => {
   console.log(FIRST,LAST);
  for (let pos = FIRST; pos <= LAST; pos++) {
    //console.log(`${movieSearchUrl}${imdbIDs[pos]}`);

    request(`${movieSearchUrl}${imdbIDs[pos]}`, (err, res, body) => {
      theJSON = JSON.parse(body);
      //console.log(theJSON.summary);
      if (theJSON.summary === 'Add a Plot »') {
        body = '';
      }
      movieInfo = body;
      return cb(movieInfo);
    });
  // });
  }
}

let count = 0;
let moviesInfo = [];

function startCollecting(FIRST, LAST) {
getMovieInfo(FIRST, LAST, data => {
  count++;
  if (LAST === count) {
    data = data.replace(/\,$/, '');
    //console.log(data.slice(-1));
    //data = data + ']';
    if (data !== '') {
      moviesInfo.push(data);
    } 
    console.log(`COUNT = ${count}`);
    if (count === 260) {
      fs.writeFile(`movieInfo_${FIRST}-${LAST}.json`, moviesInfo, 'utf8', () => {
        console.log('Finished Writing');
      });
    }
    
  } else {
    //if (count === 1) { data = '[' + data;}
    if (data !== '') {
      moviesInfo.push(data);
    } 
  }
});
}


(function setupToCollect() {
  let delay = 8000;
  let increment = 20;
  const END = 20;
  
  setTimeout(startCollecting, 0, 0, END);
  for (let i = 1; i < GROUPS; i++) {
    setTimeout(startCollecting, delay, increment + 1, END + increment);
    increment += 20;
    delay += 10000;
  }
})();


// function setRangesToCollect(START_JUMP, DELAY) {
//   setTimeout(startCollecting, DELAY, START_JUMP + 1, END_JUMP + START_JUMP);
// }




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
