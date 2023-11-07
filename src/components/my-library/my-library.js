import {
  state,
  mainSection,
  contactSection,
  currentTitle,
  cardsContainer,
  API_KEY,
  createCards,
  backToHomeBtn,
} from '../../../main.js';

const getMoviesFromKeys = async () => {
  state.movies = [];
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    let res = await fetch(
      `https://api.themoviedb.org/3/${localStorage.getItem(
        key
      )}/${key}?api_key=${API_KEY}`
    );
    const json = await res.json();
    state.movies.push(json);
  }
};

export const showLibrary = async () => {
  clearInterval(state.indexTyping);
  mainSection.style.display = 'flex';
  contactSection.style.display = 'none';
  currentTitle.textContent = 'Here is your library:';
  cardsContainer.textContent = '';
  await getMoviesFromKeys();
  createCards();
  hideButtonsAndPagesIfInLibrary();
  backToHomeBtn.style.visibility = 'visible';
};

const hideButtonsAndPagesIfInLibrary = () => {
  const sectionElementsButNotCardsContainerAndTitle = Array.from(
    document.querySelectorAll('.main-section > *')
  ).filter(
    (element) =>
      element !== currentTitle &&
      element !== cardsContainer &&
      element !== backToHomeBtn
  );
  if (currentTitle.textContent === 'Here is your library:') {
    sectionElementsButNotCardsContainerAndTitle.forEach((element) => {
      element.style.display = 'none';
    });
  } else {
    sectionElementsButNotCardsContainerAndTitle.forEach((element) => {
      element.style.display = 'inline';
    });
  }
};
