import { Media } from '../model';

export type UpdateProductRequest = {
  id: string | number;
  name?: string;
  categories?: {
    id: string | number;
  }[];
  sku?: string;
  price?: number;
  description?: string;
  media?: Media[];
};
