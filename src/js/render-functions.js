import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.getElementById('gallery');
const loaderEl = document.getElementById('loader');
const loadMoreBtn = document.getElementById('load-more-btn');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

/**
 * Додає картки зображень у галерею та оновлює lightbox.
 * @param {Array} images
 */
export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="image-info">
            <p class="image-info-item"><b>Likes</b>${likes}</p>
            <p class="image-info-item"><b>Views</b>${views}</p>
            <p class="image-info-item"><b>Comments</b>${comments}</p>
            <p class="image-info-item"><b>Downloads</b>${downloads}</p>
          </div>
        </li>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

/** Очищає галерею. */
export function clearGallery() {
  galleryEl.innerHTML = '';
}

/** Показує лоадер. */
export function showLoader() {
  loaderEl.classList.remove('hidden');
}

/** Ховає лоадер. */
export function hideLoader() {
  loaderEl.classList.add('hidden');
}

/** Показує кнопку Load more. */
export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('hidden');
}

/** Ховає кнопку Load more. */
export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('hidden');
}
