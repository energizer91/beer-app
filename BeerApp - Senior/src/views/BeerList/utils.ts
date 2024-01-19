import { getBeerList, getBeerMetaData } from '../../api';
import handle from '../../utils/error';
import { ApiParams } from '../../types';

export const fetchData = (params?: ApiParams) =>
  getBeerList(params)
    .catch(handle)
    .then((res) => res?.data || []);

export const fetchMeta = (params?: ApiParams) =>
  getBeerMetaData(params)
    .catch(handle)
    .then((res) => res?.data);
