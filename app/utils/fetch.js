import { API_URL } from '../constants/config';

const fetchPaginated = async (url, auth) => {
  const f = page =>
    fetch(`${API_URL}${url}?page=${page}`, {
      headers: auth
    }).then(res => res.json());

  // This gets the first page, so we can iterate over each page
  const { items: firstItems, total_pages: totalPages } = await f(1);

  if (totalPages <= 1) return Promise.resolve(firstItems);
  // After that, we iterate over the following pages and save the result into an array
  // This generates 1 request per page
  const otherPages = (await Promise.all(
    [...new Array(totalPages - 1)].map(async (_, i) => {
      const { items } = await f(i + 2);
      return items;
    })
  )).reduce((arr, acc) => [...acc, ...arr], []);
  const items = [...firstItems, ...otherPages];
  return Promise.resolve(items);
};

const fetchAuthenticated = () => {
  /* TODO: Implement this */
};

export { fetchPaginated, fetchAuthenticated };
