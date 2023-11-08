import { Media } from '../model';

export type CreateProductRequest = {
  name: string;
  categories: {
    id: string;
  }[];
  sku: string;
  price: number;
  description?: string;
  media?: Media[];
};
