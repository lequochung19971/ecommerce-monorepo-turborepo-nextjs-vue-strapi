import { DataSource, OrderStatus } from 'types';

export const orderStatusDataSource: DataSource<OrderStatus>[] = [
  {
    label: 'Cancelled',
    value: OrderStatus.CANCELLED,
  },
  {
    label: 'Pending',
    value: OrderStatus.PENDING,
  },
  {
    label: 'Processing',
    value: OrderStatus.PROCESSING,
  },
  {
    label: 'Shipped',
    value: OrderStatus.SHIPPED,
  },
];
