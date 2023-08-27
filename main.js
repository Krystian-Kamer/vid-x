// ************VARIABLES************

const moviesList = document.querySelector('.movies-list');
const seriesList = document.querySelector('.series-list');
const movieMenu = document.querySelector('.movie-menu');
const seriesMenu = document.querySelector('.series-menu');
const cardsContainer = document.querySelector('.cards-container');
const switchBgcOfBtn = document.querySelector('.button-bgc-switch');

// ************BUTTONS VARIABLES************
const nowPlayingMoviesBtn = document.querySelector('.btn-now-playing-movies');
const popularMoviesBtn = document.querySelector('.btn-popular-movies');
const topRatedMoviesBtn = document.querySelector('.btn-top-rated-movies');
const upcomingMoviesBtn = document.querySelector('.btn-upcoming-movies');
const buttonsListSpan = document.querySelectorAll('.btn-choose span');
const toggleBtns = [...document.querySelectorAll('.toggle-btn')];

const spanYear = document.querySelector('.current-year span');

const API_KEY = '57b4025ea3b2beb4d12b65e71d4dc270';
let movies = [];

// ************FUNCTIONS************

const fetchMovies = async (link) => {
  const res = await fetch(link);
  const json = await res.json();
  movies = json.results;
  createCards();
};

const fetchPopularMovies = async () => {
  cardsContainer.textContent = '';
  await fetchMovies(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
  );
  createCards();
};

const fetchTopRatedMovies = async () => {
  cardsContainer.textContent = '';
  await fetchMovies(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`
  );
};

const fetchUpcomingMovies = async () => {
  cardsContainer.textContent = '';
  await fetchMovies(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`
  );
};

const fetchNowPlayingMovies = async () => {
  cardsContainer.textContent = '';
  await fetchMovies(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
  );
};

fetchNowPlayingMovies();

const createCards = () => {
  movies.forEach((movie) => {
    let card = document.createElement('div');
    card.innerHTML = `<div class="card"><div class="card-poster"><img src="https://www.themoviedb.org/t/p/w220_and_h330_face${movie.backdrop_path}" alt="${movie.title} poster"></div><p class="card-title">${movie.title}</p></div>`;
    cardsContainer.append(card);
  });
};

const showMovies = () => {
  moviesList.classList.toggle('nav-ul-active');
};

const showSeries = () => {
  seriesList.classList.toggle('nav-ul-active');
};

const chooseTypeOfVideo = (toggleBtn) => {
  if (toggleBtn.classList.contains('active')) {
    switchBgcOfBtn.style.left = '0';
  } else {
    switchBgcOfBtn.style.left = '50%';
  }
  buttonsListSpan.forEach(
    (button) => (button.textContent = `${toggleBtn.textContent}`)
  );
};

const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  spanYear.textContent = ` ${currentYear} `;
};
getCurrentYear();
() =>

  // ************LISTENERS************

  movieMenu.addEventListener('click', showMovies);
seriesMenu.addEventListener('click', showSeries);

popularMoviesBtn.addEventListener('click', fetchPopularMovies);
topRatedMoviesBtn.addEventListener('click', fetchTopRatedMovies);
upcomingMoviesBtn.addEventListener('click', fetchUpcomingMovies);
nowPlayingMoviesBtn.addEventListener('click', fetchNowPlayingMovies);
toggleBtns.forEach((toggleBtn) =>
  toggleBtn.addEventListener('click', () => chooseTypeOfVideo(toggleBtn))
);
