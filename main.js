import { moviesGenres, seriesGenres } from './genres.js';

// ************VARIABLES************
const cardsContainer = document.querySelector('.cards-container');
const currentTitle = document.querySelector('h2');
const buttonsListSpan = document.querySelectorAll('.btn-choose span');
const switcherBgc = document.querySelector('.switcher-background');
const switchToMovies = document.querySelector('.switch-to-movies');
const switchToSeries = document.querySelector('.switch-to-series');
const genresBox = document.querySelector('.genres-box');
const dropdown = document.querySelector('.sort-dropdown');
const select = dropdown.querySelector('.select');
const caret = dropdown.querySelector('.caret');
const menu = dropdown.querySelector('.menu');
const options = dropdown.querySelectorAll('.menu li');
const currentPage = document.querySelector('.current-page');

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
let latestSort = 'popularity.desc';
let pageNumber = 1;
let totalPages = null;

// ************BUTTONS VARIABLES************
const switcher = document.querySelector('.switcher');
const nowPlayingVideosBtn = document.querySelector('.btn-now-playing');
const popularVideosBtn = document.querySelector('.btn-popular');
const topRatedVideosBtn = document.querySelector('.btn-top-rated');
const upcomingVideosBtn = document.querySelector('.btn-upcoming');
const discoverVideosBtn = document.querySelector('.btn-discover');
const chooseButtonsList = [...document.querySelectorAll('.btn-choose')];
const decrementBtn = document.querySelector('.decrement-page-btn');
const incrementBtn = document.querySelector('.increment-page-btn');
const allPages = document.querySelector('.allPagesBtn');

// ************FUNCTIONS************
const fetchVideos = async (link) => {
  const res = await fetch(link);
  const json = await res.json();
  movies = json.results;
  totalPages = json.total_pages;
  console.log(totalPages);
  createCards();
};

const showVideos = async (param) => {
  cardsContainer.textContent = '';
  if (param === 'now_playing' && videoFlag === 'tv') {
    param = 'airing_today';
  } else if (param === 'upcoming' && videoFlag === 'tv') {
    param = 'on_the_air';
  }

  if (param === 'discover') {
    await fetchVideos(
      `https://api.themoviedb.org/3/${param}/${videoFlag}?sort_by=${latestSort}&api_key=${API_KEY}&with_genres=${arrayOfSelectedGenres.join(
        ','
      )}&page=${pageNumber}`
    );
  } else {
    await fetchVideos(
      `https://api.themoviedb.org/3/${videoFlag}/${param}?api_key=${API_KEY}&with_genres=${arrayOfSelectedGenres.join(
        ','
      )}&page=${pageNumber}`
    );
  }
  latestParam = param;
};
showVideos('now_playing');

const createCards = () => {
  movies.forEach((movie) => {
    let card = document.createElement('div');
    let imagePath = movie.poster_path
      ? 'https://www.themoviedb.org/t/p/w220_and_h330_face' + movie.poster_path
      : movie.backdrop_path
      ? 'https://www.themoviedb.org/t/p/w220_and_h330_face' +
        movie.backdrop_path
      : './picture_not_found.jpg';
    card.innerHTML = `<div class="card">
      <div class="card-poster">
        <img src="${imagePath}" alt="${
      movie.title ? movie.title : movie.name
    } poster">
      </div>
      <p class="card-title">${movie.title ? movie.title : movie.name}</p>
    </div>`;
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
    showVideos('now_playing');
  } else {
    showVideos('airing_today');
  }
  nowPlayingVideosBtn.click();
  genresBox.textContent = '';
  uploadGenres();
};

const selectActiveChoice = (e) => {
  const activeButton = e.currentTarget;
  if (activeButton === discoverVideosBtn) {
    select.style.visibility = 'visible';
  } else {
    select.style.visibility = 'hidden';
  }

  chooseButtonsList.forEach((chooseButton) => {
    chooseButton.classList.remove('btn-choose-active');
    activeButton.classList.add('btn-choose-active');
  });
  resetPageNumber();
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
    resetPageNumber();
    arrayOfSelectedGenres.splice(index, 1);
  } else {
    arrayOfSelectedGenres.push(activeGenre.id);
    resetPageNumber();
  }

  showVideos(latestParam);
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
  let imagePath = movie.backdrop_path
    ? 'https://www.themoviedb.org/t/p/w220_and_h330_face' + movie.backdrop_path
    : movie.backdrop_path
    ? 'https://www.themoviedb.org/t/p/w220_and_h330_face' + movie.poster_path
    : './picture_not_found.jpg';
  modal.innerHTML = `<div class="modal-flex-box">
  <button class = "modal-close-btn">X</button>
<div class="modal-left-side">
<img src="${imagePath}" alt = "${movie.title ? movie.title : movie.name}">
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

const showSortOptions = () => {
  select.addEventListener('click', () => {
    select.classList.toggle('select-clicked');
    caret.classList.toggle('caret-rotate');
    menu.classList.toggle('menu-open');
  });
  options.forEach((option) => {
    option.addEventListener('click', () => {
      select.textContent = option.textContent;
      select.id = option.id;
      latestSort = select.id;
      showVideos('discover');
      resetPageNumber();
      select.classList.remove('select-clicked');
      caret.classList.remove('caret-rotate');
      menu.classList.remove('menu-open');
      options.forEach((option) => {
        option.classList.remove('active');
      });
      option.classList.add('active');
    });
  });
};
showSortOptions();

const setCurrentPage = (number) => {
  pageNumber += number;
  decrementBtn.style.visibility = pageNumber > 1 ? 'visible' : 'hidden';
  incrementBtn.style.visibility =
    pageNumber < totalPages ? 'visible' : 'hidden';
  currentPage.textContent = pageNumber < 10 ? `0${pageNumber}` : pageNumber;
  showVideos(latestParam);
};

const resetPageNumber = () => {
  pageNumber = 1;
  decrementBtn.style.visibility = 'hidden';
  incrementBtn.style.visibility = 'visible';
  currentPage.textContent = `0${pageNumber}`;
};

const loadEveryPage = () => {
  pageNumber = 1;
  for (let i = 0; i < totalPages; i++) {
    pageNumber++;
    showVideos(latestParam);
  }
};

const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  spanYear.textContent = ` ${currentYear} `;
};
getCurrentYear();

// ************LISTENERS************

nowPlayingVideosBtn.addEventListener('click', () => showVideos('now_playing'));
popularVideosBtn.addEventListener('click', () => showVideos('popular'));
topRatedVideosBtn.addEventListener('click', () => showVideos('top_rated'));
upcomingVideosBtn.addEventListener('click', () => showVideos('upcoming'));
discoverVideosBtn.addEventListener('click', () => showVideos('discover'));
switcher.addEventListener('click', switchTypeOfVideo);
chooseButtonsList.forEach((button) => {
  button.addEventListener('click', (e) => {
    setCurrentTitle(e);
    selectActiveChoice(e);
  });
});

incrementBtn.addEventListener('click', () => setCurrentPage(1));
decrementBtn.addEventListener('click', () => setCurrentPage(-1));
allPages.addEventListener('click', loadEveryPage);
