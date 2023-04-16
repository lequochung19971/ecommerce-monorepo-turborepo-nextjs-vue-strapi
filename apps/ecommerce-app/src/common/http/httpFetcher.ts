import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import { httpClient } from './httpClient';

export function httpFetcher<T = any>(
  onfulfilled?: (res: AxiosResponse<any, any>) => any,
  onrejected?: (reason: any) => PromiseLike<never>,
) {
  return async function fetcher<D = any>(
    axiosRequestConfig: AxiosRequestConfig<D>,
    extra: { arg?: AxiosRequestConfig<D> },
  ): Promise<T> {
    const { arg = {} } = extra ?? {};
    if (typeof onfulfilled === 'function') {
      return httpClient({ ...axiosRequestConfig, ...arg })
        .then(onfulfilled)
        .catch(onrejected);
    }
    return httpClient({ ...axiosRequestConfig, ...arg })
      .then((res) => res?.data)
      .catch((error) => {
        throw error;
      });
  };
}
