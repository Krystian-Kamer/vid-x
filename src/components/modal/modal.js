import { state, sections, toggleMenu, hamburgerButton } from '../../../main.js';
import { moviesGenres, seriesGenres } from '../../../genres.js';

export const createModal = async (video, keys) => {
if(hamburgerButton.classList.contains('fa-xmark')) {
  toggleMenu()
}

  const genres = await showGenresInModal(video);
  const modal = document.createElement('div');
  document.body.append(modal);
  modal.classList.add('modal');
  let imagePath = video.poster_path
    ? 'https://www.themoviedb.org/t/p/original/' + video.poster_path
    : './src/assets/picture_not_found.jpg';

  let img = new Image();
  img.src = imagePath;

  let releaseDate = video.release_date
    ? video.release_date
    : video.first_air_date
    ? video.first_air_date
    : 'Date not specified';

  img.onload = async function () {
    modal.innerHTML = `<div class="modal-flex-box">
      <button class = "modal-close-btn">X</button>
      <div class="modal-left-side">
        <img src="${img.src}" alt = "${video.title ? video.title : video.name}">
      </div>
      <div class="modal-right-side">
        <p>
            <i class="fa-solid fa-clapperboard"></i> Title:
        </p>
        <p class="modal-title">${video.title ? video.title : video.name}</p>
        <p>
            <i class="fa-solid fa-ghost"></i> Genre:
        </p>
        <p class="modal-genre">${genres}</p>
        <p>
            <i class="fa-solid fa-calendar"></i> Relase date:
        </p>
        <p class="modal-relase-date">${releaseDate}</p>
        <p>
            <i class="fa-solid fa-star"></i> Vote average:
        </p>
        <p class="modal-vote-average">${
          video.vote_average
            ? video.vote_average.toFixed(1)
            : 'Vote not specified'
        }</p>
      </div>
      </div>
      <p class="modal-overview">${
        video.overview
          ? video.overview
          : `The given video has no available description.`
      }</p>`;
    closeModal(modal);
    makeSmallerOverviewInModal(video);
    modal.classList.add('modal-active');
    const deleteButton = modal.querySelector('.modal-close-btn');
    deleteButton.addEventListener('click', () => closeModal(modal));
    sections.forEach((section) => {
      section.classList.add('blur-active');
    });
  };
};

const showGenresInModal = (video) => {
  const genres =
    state.currentVideoType === 'movie' ? moviesGenres : seriesGenres;
  const checkGenresIfInCardOrLibrary = video.genre_ids
    ? video.genre_ids
    : video.genres.map((genre) => genre.id);
  if (checkGenresIfInCardOrLibrary.length === 0)
    return ['Genres not specified'];
  else
    return checkGenresIfInCardOrLibrary
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
    if (
      modal.classList.contains('modal-active') &&
      e.target == document.body.querySelector('main')
    ) {
      closeModal(modal);
    }
  });
};

const makeSmallerOverviewInModal = (movie) => {
  const overviewsElement = document.querySelectorAll('.modal-overview');

  if (movie.overview.length > 450) {
    overviewsElement.forEach(
      (overviewElement) => (overviewElement.classList.add('modal-smaller-text'))
    );
  }

  if (movie.overview.length > 600) {
    overviewsElement.forEach(
      (overviewElement) => (overviewElement.style.fontSize = '18px')
    );
  }
};
