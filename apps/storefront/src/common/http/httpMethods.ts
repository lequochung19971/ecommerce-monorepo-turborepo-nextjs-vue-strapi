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
      method: 'GET',
    };
  },
  post: (url, data, config = {}) => ({
    ...config,
    url,
    data,
    method: 'POST',
  }),
  delete: (url, config = {}) => ({
    ...config,
    url,
    method: 'DELETE',
  }),
  patch: (url, data, config = {}) => ({
    ...config,
    url,
    data,
    method: 'PATCH',
  }),
  put: (url, data, config = {}) => ({
    ...config,
    url,
    data,
    method: 'PUT',
  }),
};
