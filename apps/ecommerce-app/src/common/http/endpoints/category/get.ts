import type { AxiosRequestConfig } from 'axios';

import type { Category } from '@/modules/products';

import { ApiUrl } from '../../apiUrl';
import { httpClient } from '../../httpClient';

export async function getCategoryBySlug<T = Category>(slug: string, config?: AxiosRequestConfig) {
  return httpClient.get<T>(`${ApiUrl.CATEGORIES_SLUG}/${slug}`, config).then((res) => res);
}

export async function getCategories<T = Category>(config?: AxiosRequestConfig) {
  return httpClient.get<T>(ApiUrl.CATEGORIES, config).then((res) => res);
}
