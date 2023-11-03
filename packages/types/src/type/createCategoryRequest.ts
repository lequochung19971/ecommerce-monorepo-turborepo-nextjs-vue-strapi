export type CreateCategoryRequest = {
  name: string;
  parentCategory?: { id: string | number };
  slug: string;
  description?: string;
};
