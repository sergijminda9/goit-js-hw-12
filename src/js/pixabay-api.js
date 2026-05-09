import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '49710889-4feda6e3f5a5dc4aa4d4bbd5f'; // Replace with your Pixabay API key
const PER_PAGE = 15;

/**
 * Fetch images from Pixabay by search query and page number.
 * @param {string} query - Search keyword
 * @param {number} page  - Page number (starts at 1)
 * @returns {Promise<{hits: Array, totalHits: number}>}
 */
export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: PER_PAGE,
      page,
    },
  });

  return response.data;
}
