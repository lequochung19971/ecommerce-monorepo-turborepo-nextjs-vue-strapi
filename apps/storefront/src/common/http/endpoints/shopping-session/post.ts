import type { AxiosRequestConfig } from 'axios';

import { ApiUrl } from '../../apiUrl';
import { httpClient } from '../../httpClient';

export async function addProductToShoppingCartEndpoint<T = unknown, TData = unknown>(
  data: TData,
  config = {} as AxiosRequestConfig,
) {
  return httpClient.post<T>(ApiUrl.SHOPPING_SESSION_CART, data, config);
}
