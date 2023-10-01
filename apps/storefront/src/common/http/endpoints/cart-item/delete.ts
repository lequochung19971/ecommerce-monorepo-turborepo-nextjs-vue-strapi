import type { AxiosRequestConfig } from 'axios';
import { ApiUrl } from 'types';

import { httpClient } from '../../httpClient';

export async function deleteCartItemEndpoint<T = unknown>(id: string | number, config = {} as AxiosRequestConfig) {
  return httpClient.delete<T>(`${ApiUrl.CART_ITEMS}/${id}`, config);
}
