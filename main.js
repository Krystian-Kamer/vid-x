import { moviesGenres, seriesGenres } from './genres.js';
import { createModal } from './src/components/modal/modal.js';

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
const pagesBox = document.querySelector('.pages-box');
const allPagesContainer = document.querySelector('.all-pages-container');
const searchInput = document.querySelector('.search-input');
const spanYear = document.querySelector('.current-year span');

export const sections = [
  document.querySelector('.nav'),
  document.querySelector('.main-section'),
  document.querySelector('.footer'),
];

const library = document.querySelector('.library-section');
const libraryBtn = document.querySelector('.nav-library');

export let state = {
  movies: [],
  arrayOfSelectedGenres: [],
  titleIsRunning: false,
  currentVideoType: 'movie',
  indexTyping: '',
  latestParam: '',
  latestSort: 'popularity.desc',
  latestInputValue: '',
  pageNumber: 1,
  totalPages: null,
};

const API_KEY = '7b4815b3acc118a02199450f50cc8cd7';

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
const searchBtn = document.querySelector('.search-btn');

// ************FUNCTIONS************
const fetchVideos = async (link) => {
  try {
    const res = await fetch(link);
    if (!res.ok) {
      throw new Error(`Cannot fetch the data, status: ${res.status}`);
    }
    const json = await res.json();
    state.movies = json.results;
    state.totalPages = json.total_pages;
    if (state.totalPages > 500) {
      state.totalPages = 500;
    }
    createCards();
  } catch (error) {
    console.log(`An error occurred: ${error.message}`);
  }
};

const showVideos = async (param) => {
  allPagesContainer.textContent = '';
  cardsContainer.textContent = '';
  if (param !== state.latestParam) state.pageNumber = 1;
  if (param === 'now_playing' && state.currentVideoType === 'tv') {
    param = 'airing_today';
  } else if (param === 'upcoming' && state.currentVideoType === 'tv') {
    param = 'on_the_air';
  }
  if (param === 'discover') {
    await fetchVideos(
      `https://api.themoviedb.org/3/${param}/${
        state.currentVideoType
      }?sort_by=${
        state.latestSort
      }&api_key=${API_KEY}&with_genres=${state.arrayOfSelectedGenres.join(
        ','
      )}&page=${state.pageNumber}&include_adult=false`
    );
  } else if (param === 'search') {
    chooseButtonsList.forEach((chooseButton) => {
      chooseButton.classList.remove('btn-choose-active');
    });
    if (searchInput.value === '') {
      searchInput.value = state.latestInputValue;
    }
    await fetchVideos(
      `https://api.themoviedb.org/3/${param}/${state.currentVideoType}?api_key=${API_KEY}&query=${searchInput.value}&page=${state.pageNumber}&include_adult=false`
    );
    state.latestInputValue = searchInput.value;
    searchInput.value = '';
    searchBtn.classList.add('search-btn-hidden');
    searchBtn.classList.remove('search-btn-visible');
  } else {
    await fetchVideos(
      `https://api.themoviedb.org/3/${
        state.currentVideoType
      }/${param}?api_key=${API_KEY}&with_genres=${state.arrayOfSelectedGenres.join(
        ','
      )}&page=${state.pageNumber}&include_adult=false`
    );
  }
  state.latestParam = param;
  criteriaNotFound();
  showAllPages();
};
showVideos('now_playing');

const createCards = () => {
  state.movies.forEach((movie) => {
    let card = document.createElement('div');
    let videoName = movie.title ? movie.title : movie.name;
    let imagePath = movie.poster_path
      ? 'https://www.themoviedb.org/t/p/w220_and_h330_face/' + movie.poster_path
      : './src/assets/picture_not_found.jpg';
    card.innerHTML = `<div class="card">
      <div class="card-poster">
        <img src="${imagePath}" alt="${videoName} poster">
      </div>
      <button class="btn-add">+</button>
      <p class="card-title">${videoName}</p>
    </div>`;
    cardsContainer.append(card);
    card.addEventListener('click', () => {
      createModal(movie);
    });

    const addButton = card.querySelector('.btn-add');

    addButton.addEventListener('click', (e) => {
      e.stopPropagation();
      addButton.textContent = addButton.textContent === '+' ? '-' : '+';
      localStorage.setItem(movie.id, videoName);
      library.innerHTML = library.innerHTML + card.innerHTML;

      const showInfoAboutVideo = document.createElement('div');
      showInfoAboutVideo.classList.add('show-info-about-video');
      document.body.appendChild(showInfoAboutVideo);

      showInfoAboutVideo.innerHTML =
        addButton.textContent === '+'
          ? `<p>You removed <span>${videoName}</span> from your library!</p>`
          : `<p>You added <span>${videoName}</span> to your library!</p>`;
      setTimeout(() => {
        showInfoAboutVideo.remove();
      }, 3800);
    });
  });
};

const showLibrary = () => {
  // console.log(localStorage);
};

showLibrary();

const switchTypeOfVideo = () => {
  state.arrayOfSelectedGenres = [];
  switcherBgc.classList.toggle('switch-bgc-to-active');
  switchToMovies.classList.toggle('switch-to-active');
  switchToSeries.classList.toggle('switch-to-active');
  state.currentVideoType = state.currentVideoType === 'movie' ? 'tv' : 'movie';
  buttonsListSpan.forEach((spanBtn) => {
    spanBtn.textContent =
      spanBtn.textContent === 'series' ? 'movies' : 'series';
    if (state.currentVideoType === 'movie') {
      upcomingVideosBtn.innerHTML = `Upcoming <span>${spanBtn.textContent}</span>`;
    } else {
      upcomingVideosBtn.innerHTML = `Airing today <span>${spanBtn.textContent}</span>`;
    }
  });
  if (state.currentVideoType === 'movie') {
    showVideos('now_playing');
  } else {
    showVideos('airing_today');
  }
  nowPlayingVideosBtn.click();
  genresBox.textContent = '';
  uploadGenres();
};

const showSearchBtn = (e) => {
  if (searchInput.value !== '') {
    searchBtn.classList.add('search-btn-visible');
    searchBtn.classList.remove('search-btn-hidden');
  } else {
    searchBtn.classList.add('search-btn-hidden');
    searchBtn.classList.remove('search-btn-visible');
  }
  if (searchInput.value !== '' && e.key === 'Enter') {
    searchBtn.click();
  }
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
  const genres =
    state.currentVideoType === 'movie' ? moviesGenres : seriesGenres;
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
  const index = state.arrayOfSelectedGenres.indexOf(activeGenre.id);
  if (index !== -1) {
    resetPageNumber();
    state.arrayOfSelectedGenres.splice(index, 1);
  } else {
    state.arrayOfSelectedGenres.push(activeGenre.id);
    resetPageNumber();
  }

  showVideos(state.latestParam);
};

const setCurrentTitle = (e) => {
  if (state.titleIsRunning) {
    clearInterval(state.indexTyping);
    state.titleIsRunning = false;
  }
  state.titleIsRunning = true;
  currentTitle.textContent = '';
  const titleFromButton = e.currentTarget;
  let number = 0;
  const addLetterToTitle = (e) => {
    currentTitle.textContent += titleFromButton.textContent[number];
    number++;
    if (number === titleFromButton.textContent.length) {
      clearInterval(state.indexTyping);
      state.titleIsRunning = false;
    }
  };
  state.indexTyping = setInterval(addLetterToTitle, 70);
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
      state.latestSort = select.id;
      showVideos('discover');
      resetPageNumber();
      select.classList.remove('select-clicked');
      caret.classList.remove('caret-rotate');
      menu.classList.remove('menu-open');
      options.forEach((option) => {
        option.classList.remove('menu-active');
      });
      option.classList.add('menu-active');
    });
  });
};
showSortOptions();

const setCurrentPage = (number) => {
  state.pageNumber += number;
  decrementBtn.style.visibility = state.pageNumber > 1 ? 'visible' : 'hidden';
  incrementBtn.style.visibility =
    state.pageNumber < state.totalPages ? 'visible' : 'hidden';
  currentPage.textContent =
    state.pageNumber < 10 ? `0${state.pageNumber}` : state.pageNumber;
  showVideos(state.latestParam);
};

const resetPageNumber = () => {
  state.pageNumber = 1;
  decrementBtn.style.visibility = 'hidden';
  incrementBtn.style.visibility = 'visible';
  currentPage.textContent = `0${state.pageNumber}`;
};

const showAllPages = () => {
  const renderPages = (start) => {
    allPagesContainer.innerHTML = '';
    let end = Math.min(start + 49, state.totalPages);
    for (let i = start; i <= end; i++) {
      const page = document.createElement('button');
      page.id = i;
      page.textContent = page.id;
      page.classList.add('page-btn');
      if (i === state.pageNumber) {
        page.classList.add('page-btn-active');
      }
      page.addEventListener('click', () => {
        document
          .querySelector('.page-btn-active')
          ?.classList.remove('page-btn-active');
        page.classList.add('page-btn-active');
        setCurrentPage(i - state.pageNumber);
      });
      allPagesContainer.append(page);
    }
    if (start > 1) {
      const prevButton = document.createElement('button');
      prevButton.classList.add('page-prev');
      prevButton.textContent = '< Prev';
      prevButton.classList.add('prev-btn');
      allPagesContainer.prepend(prevButton);
      prevButton.addEventListener('click', () => {
        renderPages(start - 50);
      });
    }
    if (end < state.totalPages) {
      const nextButton = document.createElement('button');
      nextButton.classList.add('page-next');
      nextButton.textContent = 'Next >';
      nextButton.classList.add('next-btn');
      allPagesContainer.append(nextButton);
      nextButton.addEventListener('click', () => {
        renderPages(start + 50);
      });
    }
  };
  renderPages(Math.floor((state.pageNumber - 1) / 50) * 50 + 1);
};

const criteriaNotFound = () => {
  if (cardsContainer.textContent === '') {
    cardsContainer.style.fontSize = '24px';
    pagesBox.style.display = 'none';
    cardsContainer.textContent =
      'Sorry, it looks like what you`re looking for doesn`t meet the criteria.';
  } else {
    pagesBox.style.display = 'flex';
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
searchInput.addEventListener('keyup', showSearchBtn);
searchBtn.addEventListener('click', () => {
  currentTitle.textContent = searchInput.value;
  state.pageNumber = 1;
  currentPage.textContent = state.pageNumber;
  showVideos('search');
});
// libraryBtn.addEventListener('click', showLibrary);

// const keys = Object.keys(localStorage);

// // fun aktualizacji state.movies o ulubione
// const myFav = [];

// keys.forEach((key) => {
//   fetch(`https://api.themoviedb.org/3/movie/${key}?api_key=${API_KEY}`)
//     .then((res) => res.json())
//     .then((movie) => {
//       myFav.push(movie);
//     });
//   });
//   console.log(myFav);

// console.log(
//   fetchVideos(`https://api.themoviedb.org/3/movie/1008042?api_key=${API_KEY}`)
// );
