import type { BaseModel } from '@/common/types/baseModel';

export type Category = BaseModel & {
  name: string;
  slug: string;
  description?: string;
  childCategories?: Category[];
};
