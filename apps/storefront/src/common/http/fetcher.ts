import { httpClient } from './httpClient';

export const fetcher = (url: string) => httpClient.get(url).then((res) => res.data);
