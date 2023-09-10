import { moviesGenres, seriesGenres } from './genres.js';

// ************VARIABLES************
const cardsContainer = document.querySelector('.cards-container');
const currentTitle = document.querySelector('h2');
const buttonsListSpan = document.querySelectorAll('.btn-choose span');
const switcherBgc = document.querySelector('.switcher-background');
const switchToMovies = document.querySelector('.switch-to-movies');
const switchToSeries = document.querySelector('.switch-to-series');
const genresBox = document.querySelector('.genres-box');

const sections = [
  document.querySelector('.nav'),
  document.querySelector('.main'),
  document.querySelector('.footer'),
];
const spanYear = document.querySelector('.current-year span');

const API_KEY = '7b4815b3acc118a02199450f50cc8cd7';
let movies = [];
let arrayOfSelectedGenres = [];
let titleIsRunning = false;
let videoFlag = 'movie';
let indexTyping;
let latestParam;
// ************BUTTONS VARIABLES************
const switcher = document.querySelector('.switcher');
const nowPlayingVideosBtn = document.querySelector('.btn-now-playing-movies');
const popularVideosBtn = document.querySelector('.btn-popular-movies');
const topRatedVideosBtn = document.querySelector('.btn-top-rated-movies');
const upcomingVideosBtn = document.querySelector('.btn-upcoming-movies');
const chooseButtonsList = [...document.querySelectorAll('.btn-choose')];

// ************FUNCTIONS************
const fetchMovies = async (link) => {
  const res = await fetch(link);
  const json = await res.json();
  movies = json.results;
  createCards();
};

const fetchVideos = async (param) => {
  cardsContainer.textContent = '';

  if (param === 'now_playing' && videoFlag === 'tv') {
    param = 'airing_today';
  } else if (param === 'upcoming' && videoFlag === 'tv') {
    param = 'on_the_air';
  }
  await fetchMovies(
    `https://api.themoviedb.org/3/${videoFlag}/${param}?api_key=${API_KEY}&with_genres=${arrayOfSelectedGenres.join(
      ','
    )}`
  );
  latestParam = param;
};

fetchVideos('now_playing');

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

const switchTypeOfVideo = () => {
  arrayOfSelectedGenres = [];
  switcherBgc.classList.toggle('switch-bgc-to-active');
  switchToMovies.classList.toggle('switch-to-active');
  switchToSeries.classList.toggle('switch-to-active');
  videoFlag = videoFlag === 'movie' ? 'tv' : 'movie';
  buttonsListSpan.forEach((spanBtn) => {
    spanBtn.textContent =
      spanBtn.textContent === 'series' ? 'movies' : 'series';

    if (videoFlag === 'movie') {
      upcomingVideosBtn.innerHTML = `Upcoming <span>${spanBtn.textContent}</span>`;
    } else {
      upcomingVideosBtn.innerHTML = `Airing today <span>${spanBtn.textContent}</span>`;
    }
  });
  if (videoFlag === 'movie') {
    fetchVideos('now_playing');
  } else {
    fetchVideos('airing_today');
  }
  chooseButtonsList.forEach((chooseButton) => {
    chooseButton.classList.remove('btn-choose-active');
    nowPlayingVideosBtn.classList.add('btn-choose-active');
  });
  nowPlayingVideosBtn.click();
  genresBox.textContent = '';
  uploadGenres();
};

const selectActiveChoice = (e) => {
  const activeButton = e.currentTarget;
  chooseButtonsList.forEach((chooseButton) => {
    chooseButton.classList.remove('btn-choose-active');
    activeButton.classList.add('btn-choose-active');
  });
};

const uploadGenres = () => {
  const genres = videoFlag === 'movie' ? moviesGenres : seriesGenres;
  genres.forEach((genre) => {
    const createdGenre = document.createElement('button');
    createdGenre.classList.add('genre-btn');
    createdGenre.textContent = genre.name;
    createdGenre.id = genre.id;
    genresBox.append(createdGenre);
    createdGenre.addEventListener('click', (e) => selectActiveGenres(e, genre));
  });
};
uploadGenres();

const selectActiveGenres = (e, activeGenre) => {
  const selectedGenre = e.target;
  selectedGenre.classList.toggle('genre-btn-selected');
  const index = arrayOfSelectedGenres.indexOf(activeGenre.id);
  if (index !== -1) {
    arrayOfSelectedGenres.splice(index, 1);
  } else {
    arrayOfSelectedGenres.push(activeGenre.id);
  }
  if (arrayOfSelectedGenres.includes(activeGenre.id)) {
  }
  fetchVideos(latestParam);
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

const createModal = (movie) => {
  const modal = document.createElement('div');
  document.body.append(modal);
  modal.classList.add('modal');
  modal.innerHTML = `<div class="modal-flex-box">
  <button class = "modal-close-btn">X</button>
<div class="modal-left-side">
<img src="${
    movie.backdrop_path
      ? `https://www.themoviedb.org/t/p/w220_and_h330_face${movie.backdrop_path}`
      : './picture_not_found.jpg'
  }" alt = "${movie.title ? movie.title : movie.name}">
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

const showGenresInModal = (video) => {
  const genres = videoFlag === 'movie' ? moviesGenres : seriesGenres;
  return video.genre_ids
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean)
    .join(', ');
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

nowPlayingVideosBtn.addEventListener('click', () => fetchVideos('now_playing'));
popularVideosBtn.addEventListener('click', () => fetchVideos('popular'));
topRatedVideosBtn.addEventListener('click', () => fetchVideos('top_rated'));
upcomingVideosBtn.addEventListener('click', () => fetchVideos('upcoming'));

switcher.addEventListener('click', switchTypeOfVideo);

chooseButtonsList.forEach((button) => {
  button.addEventListener('click', (e) => {
    setCurrentTitle(e);
    selectActiveChoice(e);
  });
});
