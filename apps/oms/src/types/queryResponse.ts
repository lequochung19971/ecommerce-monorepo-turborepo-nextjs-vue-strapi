export type QueryResponse<T> = {
  data?: T
  meta?: {
    pagination?: {
      page?: number
      pageCount?: number
      pageSize?: number
      total?: number
    }
  }
}
