import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const PER_PAGE = 15;

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

const form = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more-btn');

function toastError(message) {
  iziToast.error({ message, position: 'topRight', timeout: 4000 });
}

function toastInfo(message) {
  iziToast.info({ message, position: 'topRight', timeout: 4000 });
}

function smoothScrollAfterLoad() {
  const firstCard = document.querySelector('.gallery-item');
  if (!firstCard) return;
  const cardHeight = firstCard.getBoundingClientRect().height;
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}

function isEndOfCollection() {
  return currentPage * PER_PAGE >= totalHits;
}

async function fetchAndRender(isNewSearch = false) {
  // ДО запиту — ховаємо кнопку і лоадер
  hideLoadMoreButton();
  showLoader();

  // ДО запиту — очищаємо галерею при новому пошуку
  if (isNewSearch) {
    clearGallery();
  }

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;
    const hits = data.hits;

    if (hits.length === 0) {
      toastError(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    createGallery(hits);

    if (!isNewSearch) {
      smoothScrollAfterLoad();
    }

    if (isEndOfCollection()) {
      hideLoadMoreButton();
      toastInfo("We're sorry, but you've reached the end of search results.");
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    toastError('Something went wrong. Please try again later.');
    console.error(err);
  } finally {
    hideLoader();
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const query = event.currentTarget.elements.query.value.trim();
  if (!query) {
    toastError('Please enter a search term.');
    return;
  }
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;
  await fetchAndRender(true);
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  await fetchAndRender(false);
});
