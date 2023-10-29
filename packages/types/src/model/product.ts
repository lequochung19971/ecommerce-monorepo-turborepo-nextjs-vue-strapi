import { BaseModel } from './baseModel';
import { Category } from './category';

export type Product = BaseModel & {
  name: string;
  sku: string;
  price: number;
  description?: string;
  media?: any;
  categories: Category[];
};
