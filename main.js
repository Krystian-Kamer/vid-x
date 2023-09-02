// ************VARIABLES************

const cardsContainer = document.querySelector('.cards-container');
const switchBgcOfBtn = document.querySelector('.button-bgc-switch');
const switchBgcBtn = document.querySelector('.button-bgc-switch');
const currentTitle = document.querySelector('h2');

const sections = [
  document.querySelector('.nav'),
  document.querySelector('.main'),
  document.querySelector('.footer'),
];

// ************BUTTONS VARIABLES************

const nowPlayingVideosBtn = document.querySelector('.btn-now-playing-movies');
const popularVideosBtn = document.querySelector('.btn-popular-movies');
const topRatedVideosBtn = document.querySelector('.btn-top-rated-movies');
const upcomingVideosBtn = document.querySelector('.btn-upcoming-movies');
const buttonsListSpan = document.querySelectorAll('.btn-choose span');
const chooseButtonsList = [...document.querySelectorAll('.btn-choose')];
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

const fetchGenresOfVideo = async () => {
  if (currentTitle.textContent.includes('Movies')) {
    await fetchMovies(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
  } else {
    await fetchMovies(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`
    );
  }
};

//here I must make genres show
// const getGenresOfVideo = (movie) => {
//   let genres = fetchGenresOfVideo();
//   let genresNames = [];
//   return genresNames;
// };


const createCards = () => {
  movies.forEach((movie) => {
    let card = document.createElement('div');
    card.innerHTML = `<div class="card"><div class="card-poster"><img src="https://www.themoviedb.org/t/p/w220_and_h330_face${
      movie.backdrop_path
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
    upcomingVideosBtn.innerHTML = `Upcoming <span>${typeOfVideo}</span>`;
  } else if (typeOfVideo === 'Series') {
    switchBgcBtn.style.left = '50%';
    upcomingVideosBtn.innerHTML = `On the air <span>${typeOfVideo}</span>`;
  }

  buttonsListSpan.forEach((button) => {
    button.textContent = `${typeOfVideo}`;
  });
};


//here I must make the text not double
const setCurrentTitle = (e) => {
  currentTitle.textContent=" "
  const titleFromButton = e.currentTarget;
  let number = 0;

  const addLetterToTitle = (e) => {
    currentTitle.textContent += titleFromButton.textContent[number];
    number++;
    if (number === titleFromButton.textContent.length)
      return clearInterval(indexTyping);
  };

  const indexTyping = setInterval(addLetterToTitle, 70);
};

const createModal = (movie) => {
  console.log(movie);
  const modal = document.createElement('div');
  document.body.append(modal);
  modal.classList.add('modal');
  modal.innerHTML = `<div class="modal-flex-box">
  <button class = "modal-close-btn">X</button>
<div class="modal-left-side">
<img src="https://www.themoviedb.org/t/p/w220_and_h330_face${
    movie.poster_path
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
  // <p class="modal-genre"></p>
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
  makeFontSizeSmaller(movie);
  modal.classList.add('modal-active');
  const deleteButton = modal.querySelector('.modal-close-btn');
  deleteButton.addEventListener('click', () => {
    modal.classList.remove('modal-active');
    sections.forEach((section) => {
      section.classList.remove('blur-active');
    });
  });
  sections.forEach((section) => {
    section.classList.add('blur-active');
  });
};

const makeFontSizeSmaller = (movie) => {
  const overviewsElement = document.querySelectorAll('.modal-overview');
  if (movie.overview.length > 500) {
    overviewsElement.forEach(
      (overviewElement) => (overviewElement.style.fontSize = '16px')
    );
  } else if (movie.overview.length > 600) {
    overviewsElement.forEach(
      (overviewElement) => (overviewElement.style.fontSize = '14px')
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
