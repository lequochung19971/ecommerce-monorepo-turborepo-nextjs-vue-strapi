import type { AxiosRequestConfig } from 'axios';
import type { CreateOrderDetailRequest } from 'types';
import { ApiUrl } from 'types';

import { httpClient } from '../../httpClient';

export async function postOrderDetailEndpoint(data: CreateOrderDetailRequest, config = {} as AxiosRequestConfig) {
  return httpClient.post(ApiUrl.ORDER_DETAILS, data, config);
}

export async function postPaypalOrderEndpoint(data: { cartItemIds: string[] }, config = {} as AxiosRequestConfig) {
  return httpClient.post(ApiUrl.ORDER_DETAILS_PAYPAL_ORDER_CREATION, data, config);
}

export async function capturePaypalOrderEndpoint(
  data: { orderDetailId: string; paypalOrderId: string },
  config = {} as AxiosRequestConfig,
) {
  return httpClient.post(ApiUrl.ORDER_DETAILS_PAYPAL_ORDER_CAPTURE, data, config);
}
