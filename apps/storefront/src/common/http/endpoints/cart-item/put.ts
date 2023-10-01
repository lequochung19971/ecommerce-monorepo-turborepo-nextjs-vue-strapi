import type { AxiosRequestConfig } from 'axios';
import { ApiUrl } from 'types';

import type { CartItem } from '@/modules/checkout';

import { httpClient } from '../../httpClient';

export async function putCartItemEndpoint<T = unknown>(
  id: string | number,
  data: {
    data: Partial<CartItem>;
  },
  config = {} as AxiosRequestConfig,
) {
  return httpClient.put<T>(`${ApiUrl.CART_ITEMS}/${id}`, data, config);
}
