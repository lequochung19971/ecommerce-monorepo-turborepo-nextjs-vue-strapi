import { BaseModel } from './baseModel';
import { Category } from './category';
import { Media } from './media';

export type Product = BaseModel & {
  name: string;
  sku: string;
  price: number;
  description?: string;
  media?: Media[];
  categories: Category[];
};
