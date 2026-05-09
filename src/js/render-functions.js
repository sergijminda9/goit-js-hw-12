// SimpleLightbox is loaded via CDN and available as a global
const galleryEl = document.getElementById('gallery');
const loaderEl = document.getElementById('loader');
const loadMoreBtn = document.getElementById('load-more-btn');

// Create the SimpleLightbox instance once
let lightbox = null;

function getLightbox() {
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
  return lightbox;
}

/**
 * Build an SVG icon string for meta stats.
 */
function metaIcon(path) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

const ICONS = {
  likes: metaIcon(
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
  ),
  views: metaIcon(
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
  ),
  comments: metaIcon(
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
  ),
  downloads: metaIcon(
    '<polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>'
  ),
};

/**
 * Render gallery cards from an array of image objects.
 * Appends to the existing gallery and refreshes SimpleLightbox.
 * @param {Array} images
 */
export function createGallery(images) {
  const markup = images
    .map(
      (
        {
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        },
        idx
      ) => `
      <li class="gallery-item" style="animation-delay:${(idx % 15) * 40}ms">
        <a href="${largeImageURL}" data-lightbox="gallery">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="image-meta">
          <span class="meta-item">${ICONS.likes}${likes}</span>
          <span class="meta-item">${ICONS.views}${views}</span>
          <span class="meta-item">${ICONS.comments}${comments}</span>
          <span class="meta-item">${ICONS.downloads}${downloads}</span>
        </div>
        <p class="image-tags">${tags}</p>
      </li>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  getLightbox().refresh();
}

/** Remove all gallery items. */
export function clearGallery() {
  galleryEl.innerHTML = '';
}

/** Show the loading spinner. */
export function showLoader() {
  loaderEl.classList.remove('hidden');
}

/** Hide the loading spinner. */
export function hideLoader() {
  loaderEl.classList.add('hidden');
}

/** Show the "Load more" button. */
export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('hidden');
}

/** Hide the "Load more" button. */
export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('hidden');
}
