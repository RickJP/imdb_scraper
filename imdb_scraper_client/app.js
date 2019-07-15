const form = document.querySelector('form');
const searchInput = document.querySelector('input');
const resultsList = document.querySelector('#results');

const BASE_URL = 'https://greve-moliere-59401.herokuapp.com/';

form.addEventListener('submit', formSubmitted);

function formSubmitted(e) {
  e.preventDefault();
  const searchItem = searchInput.value;
  
  getSearchResults(searchItem)
    .then(showResults);
}

function getSearchResults(searchItem) {
  return fetch(`${BASE_URL}search/${searchItem}`)
    .then(res => res.json());
}

function showResults(results) {
  results.forEach(movie => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    li.appendChild(img);
    img.src = movie.image;

    const a = document.createElement('a');
    a.textContent = movie.title;
    a.href = '/movie.html?imdbID=' + movie.imdbID;

    li.appendChild(a);

    resultsList.appendChild(li);
  });
}