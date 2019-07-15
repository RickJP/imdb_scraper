const main = document.querySelector('main');
const imdbID = window.location.search.match(/imdbID=(.*)/)[1];
const BASE_URL = 'https://greve-moliere-59401.herokuapp.com/';

function getMovie(imdbID) {
  return fetch(`${BASE_URL}movie/${imdbID}`)
    .then(res => res.json());
}

function showMovie(movie) {
  const section = document.createElement('section');
  main.appendChild(section);

  // const date = dateFns.parse(movie.datePublished); 
  // movie.datePublished = date;//dateFns.format(date, 'MMMM Do YYYY');


  const props = [{
    title: 'Rating',
    property: 'contentRating'
  }, {
    title: 'Run Time',
    property: 'runTime'
    }, 
    {
      title: 'Released',
      property: 'datePublished'
    },
    {
      title: 'Summary',
      property: 'summary'
    },
    { title: 'Storyline',
      property: 'storyline'
    }];

  const descriptionHTML = props.reduce((html, prop) => {
    html += `
      <dt class="col-sm-3">${prop.title}</dt>
      <dt class="col-sm-9">${movie[prop.property]}</dt>
    `;
    return html;
  }, '');

  section.outerHTML = `
    <section class="row">
    <h1 class="text-center">${movie.title}</h1>
      <div class="col-sm-12">
        <img src="${movie.poster}" class="img-fluid" />
      </div>
      <div class="col-sm-12">
        <dl class="row">
         ${descriptionHTML}
        </dl>
      </div>
    </section>
  `;
  console.log(movie);
}

getMovie(imdbID)
  .then(showMovie);