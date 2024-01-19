import { getRandomBeerList, getFavourites, setFavourites } from '../../api';
import handle from '../../utils/error';

// re-export favourites since they are just localhost
export { getFavourites, setFavourites };

const fetchData = () =>
  getRandomBeerList(10)
    .catch(handle)
    .then((res) => res?.data || []);

export { fetchData };
