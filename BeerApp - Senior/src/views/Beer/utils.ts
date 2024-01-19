import { getBeer, getFavourite, setFavourite } from '../../api';
import { Beer } from '../../types';
import handle from '../../utils/error';

// re-export favourites since they are just localhost
export { getFavourite, setFavourite };

export type FieldsByKeyNameMap = Partial<Record<keyof Beer, string>>;
export type FieldsKeyConverter<T> = Partial<
  Record<keyof Beer, (value: string) => T>
>;

export const fetchData = async (id: string) =>
  getBeer(id)
    .then(({ data }) => data)
    .catch(handle);

export const getFields = <T = string>(
  beer: Beer,
  fieldsKeyNameMap: FieldsByKeyNameMap,
  fieldsKeyConverter?: FieldsKeyConverter<T>
): [string, T | string][] => {
  return (Object.keys(fieldsKeyNameMap) as Array<keyof Beer>)
    .filter((field) => Boolean(beer[field]))
    .map((field) => [
      fieldsKeyNameMap[field] || field || '',
      fieldsKeyConverter?.[field]?.(beer[field] || '') || beer[field] || '',
    ]);
};

export const getLocation = (beer: Beer) => {
  return `https://www.google.com/maps/search/?api=1&query=${beer.latitude},${beer.longitude}`;
};
