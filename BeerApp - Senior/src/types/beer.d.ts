import { TYPE } from './';

export interface Beer {
  id: string;
  name: string;
  brewery_type: TYPE;
  address_1?: string;
  address_2?: string;
  address_3?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  longitude: string;
  latitude: string;
  phone: string;
  website_url: string;
  state: string;
  street: string;
}

export interface BeerMeta {
  total: string;
  page: string;
  per_page: string;
}
