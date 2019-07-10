// eslint-disable

import { API_URL } from '../constants/config';

const fetchPaginated = async (url, auth, callback) => {
  const f = page =>
    fetch(`${API_URL}${url}?page=${page}`, {
      headers: auth
    }).then(res => res.json())

  // This gets the first page, so we can iterate over each page
  const { items: firstItems, total_pages: totalPages } = await f(1);
  await callback(firstItems)
  if (totalPages <= 1) return Promise.resolve(firstItems);
  // After that, we iterate over the following pages and save the result into an array
  // This generates 1 request per page
    
    for (const i of [...new Array(totalPages - 1)].map((_, i) => i)) {
      const { items } = await f(i + 2);
      await callback(items, i)
    }

  return Promise.resolve();
};

const fetchAuthenticated = () => {
  /* TODO: Implement this */
};

export { fetchPaginated, fetchAuthenticated };
