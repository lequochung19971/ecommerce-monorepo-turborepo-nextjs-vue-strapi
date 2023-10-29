import { DataSource, PaymentStatus } from 'types';

export const paymentStatusDataSource: DataSource<PaymentStatus>[] = [
  {
    label: 'Pending',
    value: PaymentStatus.PENDING,
  },
  {
    label: 'Paid',
    value: PaymentStatus.PAID,
  },
  {
    label: 'Cancelled',
    value: PaymentStatus.CANCELLED,
  },
];
