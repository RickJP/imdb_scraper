const form = document.querySelector('form');
const searchInput = document.querySelector('input');

const BASE_URL = 'https://greve-moliere-59401.herokuapp.com/';

form.addEventListener('submit', formSubmitted);

function formSubmitted(e) {
  e.preventDefault();

  console.log('form submitted');
  const searchItem = searchInput.value;
  

  getSearchResults(searchItem);
}

function getSearchResults(searchItem) {
  return fetch(`${BASE_URL}search/${searchItem}`)
    .then(res => res.json())
    .then(results => {
      console.log(results);
    });
}