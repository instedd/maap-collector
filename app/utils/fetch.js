import { stringify } from 'query-string';
import { pickBy, isUndefined } from 'lodash';
import { API_URL } from '../constants/config';

const fetchPaginated = async (
  url,
  auth,
  args = { body: {}, qs: {}, method: 'get' },
  callback
) => {
  const f = page =>
    fetch(`${API_URL}${url}?${stringify({ ...args.qs, page })}`, {
      headers: auth
    }).then(res => res.json());

  // This gets the first page, so we can iterate over each page
  const res = await f(1);
  const firstPage = res;
  const { items: firstItems, total_pages: totalPages } = res;
  await callback(firstItems, res);
  if (totalPages <= 1) return Promise.resolve(firstPage);
  // After that, we iterate over the following pages and save the result into an array
  // This generates 1 request per page
  /* eslint-disable */
  for (const i of [...new Array(totalPages - 1)].map((_, i) => i)) {
    const res = await f(i + 2);
    const { items } = res;
    await callback(items, res);
  }
  /* eslint-enable */

  return Promise.resolve(firstPage);
};

const fetchAuthenticated = (
  url,
  auth,
  args = {
    body: {},
    qs: {},
    method: 'get',
    headers: {},
    contentType: 'application/json'
  }
) =>
  fetch(`${API_URL}${url}?${stringify(args.qs)}`, {
    method: args.method,
    body:
      args.contentType === 'application/json' || isUndefined(args.contentType)
        ? JSON.stringify(args.body)
        : args.body,
    headers: {
      ...pickBy(
        {
          ...args.headers,
          'Content-Type': isUndefined(args.contentType)
            ? 'application/json'
            : args.contentType
        },
        i => i
      ),
      ...auth
    }
  }).then(res => res.json());

export { fetchPaginated, fetchAuthenticated };
