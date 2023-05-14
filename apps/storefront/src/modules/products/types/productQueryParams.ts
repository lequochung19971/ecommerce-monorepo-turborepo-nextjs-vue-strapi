import type { BaseQueryParams } from '@/common/types';

export type ProductQueryParams = BaseQueryParams & {
  page?: number;
  slug?: string;
};
