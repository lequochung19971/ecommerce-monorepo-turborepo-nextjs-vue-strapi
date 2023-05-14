import type { BaseModel, Media } from '@/common/types';

export type Product = BaseModel & {
  name: string;
  price: string;
  sku?: string;
  media?: Media[];
  description?: string;
};
