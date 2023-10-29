import { DataSource, PaymentMethod } from 'types';

export const paymentMethodDataSource: DataSource<PaymentMethod>[] = [
  {
    label: 'COD',
    value: PaymentMethod.COD,
  },
  {
    label: 'Digital Wallet',
    value: PaymentMethod.DIGITAL_WALLET,
  },
];
