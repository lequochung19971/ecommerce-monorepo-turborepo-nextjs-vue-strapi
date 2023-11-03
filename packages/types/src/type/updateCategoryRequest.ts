export type UpdateCategoryRequest = {
  id: string | number;
  name?: string;
  parentCategory?: { id: string | number };
  slug?: string;
  description?: string;
};
