import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { httpClient } from './httpClient';

export function httpFetcher<T = any>(
  onfulfilled?: (res: AxiosResponse<any, any>) => any,
  onrejected?: (reason: any) => PromiseLike<never>,
) {
  return async function fetcher<D = any>(axiosRequestConfig: AxiosRequestConfig<D>): Promise<T> {
    if (typeof onfulfilled === 'function') {
      return httpClient(axiosRequestConfig).then(onfulfilled).catch(onrejected);
    }
    return httpClient(axiosRequestConfig).then((res) => res.data);
  };
}
