import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '55782730-508b64862a8909659e50ec608';
const PER_PAGE = 15;

/**
 * @param {string} query
 * @param {number} page
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
