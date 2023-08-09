// ************VARIABLES************

const moviesList = document.querySelector('.movies-list');
const seriesList = document.querySelector('.series-list');
const movieMenu = document.querySelector('.movie-menu');
const seriesMenu = document.querySelector('.series-menu');
const cardsContainer = document.querySelector('.cards-container');

const spanYear = document.querySelector('.current-year span');
const currentYear = new Date().getFullYear();
spanYear.textContent = ` ${currentYear} `;

const API_KEY = '57b4025ea3b2beb4d12b65e71d4dc270';
let movies = [];

// ************FUNCTIONS************

const fetchMovies = async (link) => {
  const res = await fetch(link);
  const json = await res.json();
  movies = json.results;
};

const fetchPopularMovies = () => {
  fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  createCard();
};

const createCard = () => {
  for (let i = 0; i < movies.length; i++) {
    let card = document.createElement('div');
    let movieID = movies[i].id;

    cardsContainer.append(card);
    card.innerHTML = `<div class="card"><div class="card-poster"><img src=${`https://api.themoviedb.org/3/movie/${movieID}/images`}></div><p class="card-title">${
      movies[i].title
    }</p>
</div>`;
  }
};

const showMovies = () => {
  moviesList.classList.toggle('nav-ul-active');
};

const showSeries = () => {
  seriesList.classList.toggle('nav-ul-active');
};

// ************LISTENERS************

movieMenu.addEventListener('click', showMovies);
seriesMenu.addEventListener('click', showSeries);
window.addEventListener('click', fetchPopularMovies);
