import { getImagesByQuery } from './pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './render-functions.js';

// ── State ──────────────────────────────────────────────────────────────
const PER_PAGE = 15;

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

// ── DOM refs ───────────────────────────────────────────────────────────
const form = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more-btn');

// ── iziToast helpers ───────────────────────────────────────────────────
function toastError(message) {
  iziToast.error({
    message,
    position: 'topRight',
    backgroundColor: '#13131a',
    messageColor: '#f0f0f5',
    iconColor: '#ff6b35',
    progressBarColor: '#ff6b35',
    titleColor: '#ff6b35',
    timeout: 4000,
    balloon: false,
  });
}

function toastInfo(message) {
  iziToast.info({
    message,
    position: 'topRight',
    backgroundColor: '#13131a',
    messageColor: '#f0f0f5',
    iconColor: '#e8ff47',
    progressBarColor: '#e8ff47',
    timeout: 4000,
    balloon: false,
  });
}

// ── Scroll helper ──────────────────────────────────────────────────────
function smoothScrollAfterLoad() {
  const firstCard = document.querySelector('.gallery-item');
  if (!firstCard) return;
  const cardHeight = firstCard.getBoundingClientRect().height;
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}

// ── Check whether we've reached the end of results ─────────────────────
function isEndOfCollection() {
  return currentPage * PER_PAGE >= totalHits;
}

// ── Fetch and render a page of results ────────────────────────────────
async function fetchAndRender(isNewSearch = false) {
  showLoader();
  if (isNewSearch) hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    totalHits = data.totalHits;
    const hits = data.hits;

    if (isNewSearch) {
      clearGallery();

      if (hits.length === 0) {
        hideLoader();
        toastError(
          'Sorry, there are no images matching your search query. Please try again!'
        );
        return;
      }
    }

    createGallery(hits);

    // Scroll after loading additional pages (not the very first page)
    if (!isNewSearch) {
      smoothScrollAfterLoad();
    }

    // Decide whether to show the Load more button or end-of-collection notice
    if (isEndOfCollection()) {
      hideLoadMoreButton();
      toastInfo("We're sorry, but you've reached the end of search results.");
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    hideLoadMoreButton();
    toastError('Something went wrong. Please try again later.');
    console.error(err);
  } finally {
    hideLoader();
  }
}

// ── Form submit — new search ──────────────────────────────────────────
form.addEventListener('submit', async event => {
  event.preventDefault();

  const query = event.currentTarget.elements.query.value.trim();

  if (!query) {
    toastError('Please enter a search term.');
    return;
  }

  // Reset state for new search
  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  await fetchAndRender(true);
});

// ── Load more button ──────────────────────────────────────────────────
loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  await fetchAndRender(false);
});
