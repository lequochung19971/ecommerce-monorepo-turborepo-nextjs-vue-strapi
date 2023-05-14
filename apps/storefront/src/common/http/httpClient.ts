import axios from 'axios';
import { getSession } from 'next-auth/react';
import { stringify } from 'qs';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  paramsSerializer: {
    serialize: (params) => {
      return stringify(params);
    },
  },
});

type RequestParams = Parameters<typeof httpClient.interceptors.request.use>;
type ResponseParams = Parameters<typeof httpClient.interceptors.response.use>;

// ================================== Interceptors Request ==================================
const requestFulfilled: RequestParams[0] = async (config) => {
  const sessionData = await getSession();
  if (sessionData) {
    (config.headers as any)?.setAuthorization(`Bearer ${sessionData.user?.accessToken}`);
  }

  return config;
};

const requestError: RequestParams[1] = async (error) => {
  return Promise.reject(error);
};

// ================================== Interceptors Response ==================================
const responseFulfilled: ResponseParams[0] = (config) => {
  return config;
};
const responseError: ResponseParams[1] = async (error) => {
  return Promise.reject(error);
};

httpClient.interceptors.request.use(requestFulfilled, requestError);
httpClient.interceptors.response.use(responseFulfilled, responseError);
