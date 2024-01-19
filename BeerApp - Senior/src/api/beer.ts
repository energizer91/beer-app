import axios from 'axios';
import { API } from './config';
import { ApiParams, Beer, BeerMeta } from '../types';

export const getBeer = (id: string) => axios.get<Beer>(`${API}breweries/${id}`);

export const getBeerList = (params?: ApiParams) =>
  axios.get<Beer[]>(`${API}breweries`, { params });

/**
 * @param size Int between 1 and 50. Default is 3.
 * @returns New promise with api call for random beer list.
 */
export const getRandomBeerList = (size = 3) =>
  axios.get<Beer[]>(`${API}breweries/random`, {
    params: { size },
    headers: {
      'Cache-Control': 'no-cache', // don't cache random requests
    },
  });

export const searchBeerList = (query: string, isAutoComplete = false) =>
  axios.get<Beer[]>(
    `${API}breweries/${isAutoComplete ? 'autocomplete' : 'search'}`,
    {
      params: { query },
    }
  );

export const getBeerMetaData = (params?: ApiParams) =>
  axios.get<BeerMeta>(`${API}breweries/meta`, { params });

// in the future they could be an API call, but we use local storage for now
// making them async, so they could later be rewritten to fetch
export const getFavourites = async (): Promise<Beer[]> => {
  try {
    return JSON.parse(localStorage.getItem('favourites') || '') || [];
  } catch (_) {
    return [];
  }
};

export const setFavourites = async (favourites: Beer[]) => {
  localStorage.setItem('favourites', JSON.stringify(favourites));

  return favourites;
};

export const getFavourite = async (id?: string) => {
  if (!id) return false;

  const favourites = await getFavourites();

  return !!favourites.find((b) => b.id === id);
};

export const setFavourite = async (beer?: Beer) => {
  if (!beer) return false;

  const beers = await getFavourites();
  const existingId = beers.findIndex((b) => b.id === beer.id);

  if (existingId >= 0) {
    beers.splice(existingId, 1);
  } else {
    beers.push(beer);
  }

  await setFavourites(beers);

  return existingId === -1; // return true if beer has been added to favourites and false if not
};
