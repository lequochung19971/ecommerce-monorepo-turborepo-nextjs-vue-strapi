const sortConfig = {
  [1]: 'asc',
  [-1]: 'desc'
}

export const convertToSortString = (sortField: string, sortOrder: number) => {
  return sortOrder
    ? `${sortField}:${sortConfig[sortOrder as unknown as keyof typeof sortConfig]}`
    : (sortField as string)
}
