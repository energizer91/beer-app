import { getRandomBeerList } from '../../api';
import handle from '../../utils/error';

export const fetchData = () =>
  getRandomBeerList(10)
    .catch(handle)
    .then((res) => res?.data || []);
