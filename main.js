// ************VARIABLES************

const moviesList = document.querySelector('.movies-list');
const seriesList = document.querySelector('.series-list');
const movieMenu = document.querySelector('.movie-menu');
const seriesMenu = document.querySelector('.series-menu');
const cardsContainer = document.querySelector('.cards-container');
const switchBgcOfBtn = document.querySelector('.button-bgc-switch');

// ************BUTTONS VARIABLES************
// ************BUTTONS VARIABLES************
const nowPlayingVideosBtn = document.querySelector('.btn-now-playing-movies');
const popularVideosBtn = document.querySelector('.btn-popular-movies');
const topRatedVideosBtn = document.querySelector('.btn-top-rated-movies');
const upcomingVideosBtn = document.querySelector('.btn-upcoming-movies');
const buttonsListSpan = document.querySelectorAll('.btn-choose span');

const switchBgcBtn = document.querySelector('.button-bgc-switch');
const switchToMoviesBtn = document.querySelector('.switch-btn-movies');
const switchToSeriesBtn = document.querySelector('.switch-btn-series');

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

const fetchNowPlayingVideos = async () => {
  cardsContainer.textContent = '';

  if (nowPlayingVideosBtn.textContent.includes('Movies')) {
    await fetchMovies(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
    );
  } else if (nowPlayingVideosBtn.textContent.includes('Series')) {
    await fetchMovies(
      `https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}`
    );
  }
};

const fetchPopularVideos = async () => {
  cardsContainer.textContent = '';

  if (popularVideosBtn.textContent.includes('Movies')) {
    await fetchMovies(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
  } else {
    await fetchMovies(
      `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`
    );
  }
};

const fetchTopRatedVideos = async () => {
  cardsContainer.textContent = '';

  if (topRatedVideosBtn.textContent.includes('Movies')) {
    await fetchMovies(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`
    );
  } else {
    await fetchMovies(
      `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`
    );
  }
};

const fetchUpcomingVideos = async () => {
  cardsContainer.textContent = '';

  if (upcomingVideosBtn.textContent.includes('Movies')) {
    await fetchMovies(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`
    );
  } else {
    await fetchMovies(
      `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}`
    );
  }
};

fetchNowPlayingVideos();

const createCards = () => {
  movies.forEach((movie) => {
    console.log(movie);
    let card = document.createElement('div');
    card.innerHTML = `<div class="card"><div class="card-poster"><img src="https://www.themoviedb.org/t/p/w220_and_h330_face${
      movie.poster_path
    }" alt="${
      movie.title ? movie.title : movie.name
    } poster"></div><p class="card-title">${
      movie.title ? movie.title : movie.name
    }</p></div>`;
    cardsContainer.append(card);
  });
};

const showMovies = () => {
  moviesList.classList.toggle('nav-ul-active');
};

const showSeries = () => {
  seriesList.classList.toggle('nav-ul-active');
};

const toggleButton = (typeOfVideo) => {
  if (typeOfVideo === 'Movies') {
    switchBgcBtn.style.left = '0';
    switchToMoviesBtn.classList.add('active');
    switchToSeriesBtn.classList.remove('active');
    upcomingVideosBtn.innerHTML = `Upcoming <span>${typeOfVideo}</span>`;
  } else if (typeOfVideo === 'Series') {
    switchBgcBtn.style.left = '50%';
    switchToMoviesBtn.classList.remove('active');
    switchToSeriesBtn.classList.add('active');
    upcomingVideosBtn.innerHTML = `On the air <span>${typeOfVideo}</span>`;
  }

  buttonsListSpan.forEach((button) => {
    button.textContent = `${typeOfVideo}`;
  });
};

const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  spanYear.textContent = ` ${currentYear} `;
};
getCurrentYear();

// ************LISTENERS************

movieMenu.addEventListener('click', showMovies);
seriesMenu.addEventListener('click', showSeries);

nowPlayingVideosBtn.addEventListener('click', fetchNowPlayingVideos);
popularVideosBtn.addEventListener('click', fetchPopularVideos);
topRatedVideosBtn.addEventListener('click', fetchTopRatedVideos);
upcomingVideosBtn.addEventListener('click', fetchUpcomingVideos);
switchToMoviesBtn.addEventListener('click', () => toggleButton('Movies'));
switchToSeriesBtn.addEventListener('click', () => toggleButton('Series'));
