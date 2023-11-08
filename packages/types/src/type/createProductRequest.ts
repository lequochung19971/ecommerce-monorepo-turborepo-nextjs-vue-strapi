import { Media } from '../model';

export type CreateProductRequest = {
  name: string;
  categories: {
    id: string | number;
  }[];
  sku: string;
  price: number;
  description?: string;
  media?: Media[];
};
