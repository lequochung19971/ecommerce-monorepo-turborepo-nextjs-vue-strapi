export type QueryResponse<T = unknown> = {
  data: T;
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};
