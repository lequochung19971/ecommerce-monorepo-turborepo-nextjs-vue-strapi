import type { AxiosRequestConfig } from 'axios';

type HttpMethod = {
  get<D = any>(url: string, config?: AxiosRequestConfig<D>): AxiosRequestConfig<D>;
  post<D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): AxiosRequestConfig<D>;
  delete<D = any>(url: string, config?: AxiosRequestConfig<D>): AxiosRequestConfig<D>;
  put<D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): AxiosRequestConfig<D>;
  patch<D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): AxiosRequestConfig<D>;
};

export const httpMethods: HttpMethod = {
  get: (url, config = {}) => {
    return {
      ...config,
      url,
    };
  },
  post: (url, data, config = {}) => ({
    ...config,
    url,
    data,
  }),
  delete: (url, config = {}) => ({
    ...config,
    url,
  }),
  patch: (url, data, config = {}) => ({
    ...config,
    url,
    data,
  }),
  put: (url, data, config = {}) => ({
    ...config,
    url,
    data,
  }),
};
