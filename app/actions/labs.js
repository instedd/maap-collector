import db from '../db';

const FETCH_LABS = 'FETCH_LABS';
const FETCH_LABS_FAILED = 'FETCH_LABS_FAILED';

// TODO: Abstract this to a helper function
const fetchPaginated = async url => {
  const f = page => fetch(`${url}?page=${page}`).then(res => res.json());

  // This gets the first page, so we can iterate over each page
  const { items: firstItems, total_pages: totalPages } = await f(1);

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

const labMapper = props => ({
  ...props,
  remoteId: props.id
});

export const fetchLabs = () => async dispatch => {
  dispatch({ type: FETCH_LABS });
  const { Lab } = db.initialize('asd', '123');
  fetchPaginated('http://localhost:3000/api/v1/labs')
    .then(res =>
      res.map(async item => {
        const mapper = labMapper(item);
        return (
          Lab.findOrBuild({ where: { id: mapper.remoteId } })
            // TODO: Do queries only if changed
            // TODO: Only update if the remote is more recent (mapper.updated_at > lab.updatedAt). Otherwise
            .then(([lab]) => lab.update(mapper))
            .catch(e => console.log(e))
        );
      })
    )
    .catch(error => dispatch({ type: FETCH_LABS_FAILED, error }));
};

export { FETCH_LABS, FETCH_LABS_FAILED };
