import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const cardRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  listRef.innerHTML = '';
  cardRef.innerHTML = '';

  const searchValue = e.target.value.trim();

  if (!searchValue) {
    return;
  }

  fetchCountries(searchValue).then(onSuccess).catch(onError);
}

function onSuccess(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2) {
    createMarkupList(data);
  } else {
    createMarkupCard(data);
  }
}

function onError(err) {
  if (err.message === 'Not Found') {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  } else {
    Notiflix.Notify.failure(err.message);
  }
}

function createMarkupList(arr) {
  const markupList = arr
    .map(
      ({ name, flags }) =>
        `<li class="list"><img src="${flags.svg}" alt="" width="20px"><span>${name.official}</span></li>`
    )
    .join('');
  listRef.innerHTML = markupList;
}

function createMarkupCard(arr) {
  const obj = arr[0];
  const markupCard = `<div class="wrap"><img src="${
    obj.flags.svg
  }" alt=""width="40px"><h1>${obj.name.official}</h1></div>
  <p><span>Capital: </span>${obj.capital}</p>
  <p><span>Population: </span>${obj.population}</p>
  <p><span>Languages: </span>${Object.values(obj.languages).join(', ')}</p>`;
  cardRef.innerHTML = markupCard;
}
