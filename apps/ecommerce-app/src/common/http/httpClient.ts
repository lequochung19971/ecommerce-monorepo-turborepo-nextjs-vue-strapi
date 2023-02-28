import axios from 'axios';
import { stringify } from 'qs';

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  paramsSerializer: {
    serialize: (params) => {
      return stringify(params);
    },
  },
});
