// ************VARIABLES************

const moviesList = document.querySelector('.movies-list');
const seriesList = document.querySelector('.series-list');
const movieMenu = document.querySelector('.movie-menu');
const seriesMenu = document.querySelector('.series-menu');
const cardsContainer = document.querySelector('.cards-container');

const nowPlayingMoviesBtn = document.querySelector('.btn-now-playing-movies');
const popularMoviesBtn = document.querySelector('.btn-popular-movies');
const topRatedMoviesBtn = document.querySelector('.btn-top-rated-movies');
const upcomingMoviesBtn = document.querySelector('.btn-upcoming-movies');

const spanYear = document.querySelector('.current-year span');

const API_KEY = '57b4025ea3b2beb4d12b65e71d4dc270';
let movies = [];

// ************FUNCTIONS************

const fetchMovies = async (link) => {
  const res = await fetch(link);
  const json = await res.json();
  movies = json.results;
};

const fetchPopularMovies = () => {
  cardsContainer.textContent = '';
  fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  createCards();
};

const fetchTopRatedMovies = (params) => {
  cardsContainer.textContent = '';
  fetchMovies(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`
  );
  createCards();
};

const fetchUpcomingMovies = (params) => {
  cardsContainer.textContent = '';
  fetchMovies(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`);
  createCards();
};

const fetchNowPlayingMovies = (params) => {
  cardsContainer.textContent = '';
  fetchMovies(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
  );
  createCards();
};

const createCards = () => {
  for (let i = 0; i < movies.length; i++) {
    let card = document.createElement('div');
    let movieID = movies[i].id;
    cardsContainer.append(card);
    card.innerHTML = `<div class="card"><div class="card-poster"><img src="
    https://www.themoviedb.org/t/p/w220_and_h330_face${movies[i].poster_path}"></div><p class="card-title">${movies[i].title}</p></div>`;
    console.log(movies[i].poster_path);
  }

};

const showMovies = () => {
  moviesList.classList.toggle('nav-ul-active');
};

const showSeries = () => {
  seriesList.classList.toggle('nav-ul-active');
};

const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  spanYear.textContent = ` ${currentYear} `;
};
getCurrentYear();

// ************LISTENERS************

movieMenu.addEventListener('click', showMovies);
seriesMenu.addEventListener('click', showSeries);

popularMoviesBtn.addEventListener('click', fetchPopularMovies);
topRatedMoviesBtn.addEventListener('click', fetchTopRatedMovies);
upcomingMoviesBtn.addEventListener('click', fetchUpcomingMovies);
nowPlayingMoviesBtn.addEventListener('click', fetchNowPlayingMovies);
