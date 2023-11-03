import { BaseModel } from './baseModel';

export type Category = BaseModel & {
  name: string;
  slug: string;
  description?: string;
  childCategories?: Category[];
  parentCategory?: Category;
};
