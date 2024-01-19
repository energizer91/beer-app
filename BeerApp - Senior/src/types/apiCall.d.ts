export interface FilterParams {
  by_city?: string;
  by_name?: string;
  by_state?: string;
  by_postal?: number | string; // 5-digit, or 9-digit with underscore
  by_country?: string;
  by_type?: string;
  by_dist?: string; // `${latitude as Number}, ${longitude as Number}`
}

interface ApiParams extends FilterParams {
  per_page?: number; // Int between 1 and 200. Default is 50.
  page?: number;
  sort?: string; // Not working with by_dist.
}

export type { ApiParams };
