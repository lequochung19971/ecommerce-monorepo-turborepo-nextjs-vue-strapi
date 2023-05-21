import type { AxiosRequestConfig } from 'axios';
import type { AddItemToShoppingSessionRequest } from 'types';

import { ApiUrl } from '../../apiUrl';
import { httpClient } from '../../httpClient';

export async function addProductToShoppingCartEndpoint<T = unknown, TData = AddItemToShoppingSessionRequest>(
  data: TData,
  config = {} as AxiosRequestConfig,
) {
  return httpClient.post<T>(ApiUrl.SHOPPING_SESSION_CART, data, config);
}
