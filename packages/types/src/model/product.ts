import { BaseModel } from './baseModel';

export type Product = BaseModel & {
  name: string;
  sku: string;
  price: number;
  description?: string;
  media?: any;
};
