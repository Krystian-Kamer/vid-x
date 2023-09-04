// ************VARIABLES************
const cardsContainer = document.querySelector('.cards-container');
const switchBgcOfBtn = document.querySelector('.button-bgc-switch');
const switchBgcBtn = document.querySelector('.button-bgc-switch');
const currentTitle = document.querySelector('h2');
const buttonsListSpan = document.querySelectorAll('.btn-choose span');

const sections = [
  document.querySelector('.nav'),
  document.querySelector('.main'),
  document.querySelector('.footer'),
];
const spanYear = document.querySelector('.current-year span');
const API_KEY = '7b4815b3acc118a02199450f50cc8cd7';
let movies = [];
let titleIsRunning = false;
let indexTyping;
const moviesGenres = [
  {
    id: 28,
    name: 'Action',
  },
  {
    id: 12,
    name: 'Adventure',
  },
  {
    id: 16,
    name: 'Animation',
  },
  {
    id: 35,
    name: 'Comedy',
  },
  {
    id: 80,
    name: 'Crime',
  },
  {
    id: 99,
    name: 'Documentary',
  },
  {
    id: 18,
    name: 'Drama',
  },
  {
    id: 10751,
    name: 'Family',
  },
  {
    id: 14,
    name: 'Fantasy',
  },
  {
    id: 36,
    name: 'History',
  },
  {
    id: 27,
    name: 'Horror',
  },
  {
    id: 10402,
    name: 'Music',
  },
  {
    id: 9648,
    name: 'Mystery',
  },
  {
    id: 10749,
    name: 'Romance',
  },
  {
    id: 878,
    name: 'Science Fiction',
  },
  {
    id: 10770,
    name: 'TV Movie',
  },
  {
    id: 53,
    name: 'Thriller',
  },
  {
    id: 10752,
    name: 'War',
  },
  {
    id: 37,
    name: 'Western',
  },
];
const seriesGenres = [
  {
    id: 10759,
    name: 'Action & Adventure',
  },
  {
    id: 16,
    name: 'Animation',
  },
  {
    id: 35,
    name: 'Comedy',
  },
  {
    id: 80,
    name: 'Crime',
  },
  {
    id: 99,
    name: 'Documentary',
  },
  {
    id: 18,
    name: 'Drama',
  },
  {
    id: 10751,
    name: 'Family',
  },
  {
    id: 10762,
    name: 'Kids',
  },
  {
    id: 9648,
    name: 'Mystery',
  },
  {
    id: 10763,
    name: 'News',
  },
  {
    id: 10764,
    name: 'Reality',
  },
  {
    id: 10765,
    name: 'Sci-Fi & Fantasy',
  },
  {
    id: 10766,
    name: 'Soap',
  },
  {
    id: 10767,
    name: 'Talk',
  },
  {
    id: 10768,
    name: 'War & Politics',
  },
  {
    id: 37,
    name: 'Western',
  },
];

// ************BUTTONS VARIABLES************
const nowPlayingVideosBtn = document.querySelector('.btn-now-playing-movies');
const popularVideosBtn = document.querySelector('.btn-popular-movies');
const topRatedVideosBtn = document.querySelector('.btn-top-rated-movies');
const upcomingVideosBtn = document.querySelector('.btn-upcoming-movies');
const chooseButtonsList = [...document.querySelectorAll('.btn-choose')];
const switchToMoviesBtn = document.querySelector('.switch-btn-movies');
const switchToSeriesBtn = document.querySelector('.switch-btn-series');

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
  } else {
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
    let card = document.createElement('div');
    card.innerHTML = `<div class="card"><div class="card-poster"><img src="https://www.themoviedb.org/t/p/w220_and_h330_face${
      movie.poster_path
    }" alt="${
      movie.title ? movie.title : movie.name
    } poster"></div><p class="card-title">${
      movie.title ? movie.title : movie.name
    }</p></div>`;
    cardsContainer.append(card);
    card.addEventListener('click', () => {
      createModal(movie);
    });
  });
};

const toggleButton = (typeOfVideo) => {
  if (typeOfVideo === 'Movies') {
    switchBgcBtn.style.left = '0';
    switchToMoviesBtn.classList.add('toggle-active');
    switchToSeriesBtn.classList.remove('toggle-active');
    upcomingVideosBtn.innerHTML = `Upcoming <span>${typeOfVideo}</span>`;
  } else {
    switchBgcBtn.style.left = '50%';
    switchToSeriesBtn.classList.add('toggle-active');
    switchToMoviesBtn.classList.remove('toggle-active');
    upcomingVideosBtn.innerHTML = `On the air <span>${typeOfVideo}</span>`;
  }
  buttonsListSpan.forEach((button) => {
    button.textContent = `${typeOfVideo}`;
  });
};

const setCurrentTitle = (e) => {
  if (titleIsRunning) {
    clearInterval(indexTyping);
    titleIsRunning = false;
  }
  titleIsRunning = true;
  currentTitle.textContent = '';
  const titleFromButton = e.currentTarget;
  let number = 0;
  const addLetterToTitle = (e) => {
    currentTitle.textContent += titleFromButton.textContent[number];
    number++;
    if (number === titleFromButton.textContent.length) {
      clearInterval(indexTyping);
      titleIsRunning = false;
    }
  };
  indexTyping = setInterval(addLetterToTitle, 70);
};

const showGenresInModal = (movie) => {
  let arrayOfCategories = [];
  console.log(movie);
  movie.genre_ids.forEach((movieId) => {
    moviesGenres.forEach((movieGenre) => {
      if (movieId === movieGenre.id) {
        arrayOfCategories.push(movieGenre.name);
      }
    });
  });
  return arrayOfCategories.join(", ");
};

const createModal = (movie) => {
  const modal = document.createElement('div');
  document.body.append(modal);
  modal.classList.add('modal');
  modal.innerHTML = `<div class="modal-flex-box">
  <button class = "modal-close-btn">X</button>
<div class="modal-left-side">
<img src="https://www.themoviedb.org/t/p/w220_and_h330_face${
    movie.backdrop_path
  }" alt="${movie.title ? movie.title : movie.name} poster">
</div>
<div class="modal-right-side">
  <p>
      <i class="fa-solid fa-clapperboard"></i> Title:
  </p>
  <p class="modal-title">${movie.title ? movie.title : movie.name}</p>
  <p>
      <i class="fa-solid fa-ghost"></i> Genre:
  </p>
  <p class="modal-genre">${showGenresInModal(movie)}</p>
  <p>
      <i class="fa-solid fa-calendar"></i> Relase date:
  </p>
  <p class="modal-relase-date">${
    movie.release_date ? movie.release_date : movie.first_air_date
  }</p>
  <p>
      <i class="fa-solid fa-star"></i> Vote average:
  </p>
  <p class="modal-vote-average">${movie.vote_average}</p>
</div>
</div>
<p class="modal-overview">${movie.overview}</p>`;
  closeModal(modal);
  makeFontSizeSmaller(movie);
  modal.classList.add('modal-active');
  const deleteButton = modal.querySelector('.modal-close-btn');
  deleteButton.addEventListener('click', () => closeModal(modal));
  sections.forEach((section) => {
    section.classList.add('blur-active');
  });
};

const closeModal = (modal) => {
  modal.classList.remove('modal-active');
  sections.forEach((section) => {
    section.classList.remove('blur-active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(modal);
    }
  });
  document.addEventListener('click', (e) => {
    if (modal.classList.contains('modal-active') && e.target == document.body) {
      closeModal(modal);
    }
  });
};

const makeFontSizeSmaller = (movie) => {
  const overviewsElement = document.querySelectorAll('.modal-overview');
  if (movie.overview.length > 600) {
    overviewsElement.forEach(
      (overviewElement) => (overviewElement.style.fontSize = '18px')
    );
  }
};

const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  spanYear.textContent = ` ${currentYear} `;
};
getCurrentYear();

// ************LISTENERS************

nowPlayingVideosBtn.addEventListener('click', fetchNowPlayingVideos);
popularVideosBtn.addEventListener('click', fetchPopularVideos);
topRatedVideosBtn.addEventListener('click', fetchTopRatedVideos);
upcomingVideosBtn.addEventListener('click', fetchUpcomingVideos);
switchToMoviesBtn.addEventListener('click', () => toggleButton('Movies'));
switchToSeriesBtn.addEventListener('click', () => toggleButton('Series'));
chooseButtonsList.forEach((button) => {
  button.addEventListener('click', setCurrentTitle);
});
