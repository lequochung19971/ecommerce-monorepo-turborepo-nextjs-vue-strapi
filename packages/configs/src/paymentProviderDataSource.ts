import { DataSource, PaymentProvider } from 'types';

export const paymentProviderDataSource: DataSource<PaymentProvider>[] = [
  {
    label: 'Paypal',
    value: PaymentProvider.PAYPAL,
  },
  {
    label: 'Stripe',
    value: PaymentProvider.STRIPE,
  },
];
