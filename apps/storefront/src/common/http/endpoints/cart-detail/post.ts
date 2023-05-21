import type { AxiosRequestConfig } from 'axios';
import type { CreateOrderDetailRequest } from 'types';

import { ApiUrl } from '../../apiUrl';
import { httpClient } from '../../httpClient';

export async function postOrderDetailEndpoint<D = CreateOrderDetailRequest>(
  data: D,
  config = {} as AxiosRequestConfig,
) {
  return httpClient.post<D>(ApiUrl.ORDER_DETAILS, data, config);
}
