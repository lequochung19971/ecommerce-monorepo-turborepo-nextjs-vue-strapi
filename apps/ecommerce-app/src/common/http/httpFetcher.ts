import type { AxiosRequestConfig } from 'axios';

import { httpClient } from './httpClient';

export function httpFetcher<T = any>() {
  return async function fetcher<D = any>(axiosRequestConfig: AxiosRequestConfig<D>): Promise<T> {
    return httpClient(axiosRequestConfig).then((res) => res.data);
  };
}
