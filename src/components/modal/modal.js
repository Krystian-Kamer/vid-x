import { state } from '../../../main.js';
import { sections } from '../../../main.js';
import { moviesGenres, seriesGenres } from '../../../genres.js';

export const createModal = (movie) => {
  const modal = document.createElement('div');
  document.body.append(modal);
  modal.classList.add('modal');
  let imagePath = movie.poster_path
    ? 'https://www.themoviedb.org/t/p/original/' + movie.poster_path
    : './src/assets/picture_not_found.jpg';

  let img = new Image();
  img.src = imagePath;

  let releaseDate = movie.release_date
    ? movie.release_date
    : movie.first_air_date
    ? movie.first_air_date
    : 'Date not specified';

  img.onload = function () {
    modal.innerHTML = `<div class="modal-flex-box">
      <button class = "modal-close-btn">X</button>
      <div class="modal-left-side">
        <img src="${img.src}" alt = "${movie.title ? movie.title : movie.name}">
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
        <p class="modal-relase-date">${releaseDate}</p>
        <p>
            <i class="fa-solid fa-star"></i> Vote average:
        </p>
        <p class="modal-vote-average">${
          movie.vote_average
            ? movie.vote_average.toFixed(1)
            : 'Vote not specified'
        }</p>
      </div>
      </div>
      <p class="modal-overview">${
        movie.overview
          ? movie.overview
          : `The given video has no available description.`
      }</p>`;
    closeModal(modal);
    makeSmallerOverviewInModal(movie);
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
  if (video.genre_ids.length === 0)
    return (video.genre_ids = ['Genres not specified']);
  else
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

const makeSmallerOverviewInModal = (movie) => {
  const overviewsElement = document.querySelectorAll('.modal-overview');
  if (movie.overview.length > 600) {
    overviewsElement.forEach(
      (overviewElement) => (overviewElement.style.fontSize = '18px')
    );
  }
};

console.log(localStorage.getItem('myCat'));

