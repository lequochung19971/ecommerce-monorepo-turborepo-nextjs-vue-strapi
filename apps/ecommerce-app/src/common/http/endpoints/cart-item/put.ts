import type { AxiosRequestConfig } from 'axios';

import type { CartItem } from '@/modules/checkout';

import { ApiUrl } from '../../apiUrl';
import { httpClient } from '../../httpClient';

export async function putCartItem<T = unknown>(
  id: string | number,
  data: {
    data: Partial<CartItem>;
  },
  config = {} as AxiosRequestConfig,
) {
  return httpClient.put<T>(`${ApiUrl.CART_ITEMS}/${id}`, data, config);
}
