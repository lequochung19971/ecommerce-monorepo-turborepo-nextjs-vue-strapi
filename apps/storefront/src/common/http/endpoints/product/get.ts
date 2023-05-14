import type { AxiosRequestConfig } from 'axios';

import type { Product } from '@/modules/products';

import { ApiUrl } from '../../apiUrl';
import { httpClient } from '../../httpClient';

export async function getProductsEndpoint<
  T = {
    data: Product[];
  },
>(config: AxiosRequestConfig) {
  return httpClient.get<T>(ApiUrl.PRODUCTS, config);
}
