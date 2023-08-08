const movieList = document.querySelector('.movies-list');
const seriesList = document.querySelector('.series-list');
const movieMenu = document.querySelector('.movie-menu');
const seriesMenu = document.querySelector('.series-menu');

const spanYear = document.querySelector('.current-year span');
const currentYear = new Date().getFullYear();
spanYear.textContent = ` ${currentYear} `;

const API_KEY = '57b4025ea3b2beb4d12b65e71d4dc270';
let movies = [];

const fetchMovies = async (link) => {
  const res = await fetch(link);
  const json = await res.json();
  movies = json.results;
};

const fetchPopularMovies = () => {
  fetchMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
  titles();
};

// movies.map((map) => renderCadr);

const movieTitle = document.createElement('h1');

const showMovies = () => {
  movieList.classList.toggle('nav-ul-active');
};

const titles = () => {
  movies.map((movie) => {
    console.log(movie);
  });
};

const showSeries = () => {
  seriesList.classList.toggle('nav-ul-active');
};

movieMenu.addEventListener('click', showMovies);
seriesMenu.addEventListener('click', showSeries);
window.addEventListener('click', fetchPopularMovies);
