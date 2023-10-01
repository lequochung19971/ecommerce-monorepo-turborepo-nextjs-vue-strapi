import type { AxiosRequestConfig } from 'axios';
import { ApiUrl } from 'types';

import type { Category } from '@/modules/products';

import { httpClient } from '../../httpClient';

export async function getCategoryBySlugEndpoint<T = Category>(slug: string, config?: AxiosRequestConfig) {
  return httpClient.get<T>(`${ApiUrl.CATEGORIES_SLUG}/${slug}`, config);
}

export async function getCategoriesEndpoint<T = Category>(config?: AxiosRequestConfig) {
  return httpClient.get<T>(ApiUrl.CATEGORIES, config);
}
