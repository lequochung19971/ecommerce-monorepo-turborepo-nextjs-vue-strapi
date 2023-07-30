import { Address } from './address';
import { PaymentProvider } from './paymentProvider';
import { PaymentType } from './paymentType';

export type CreateOrderDetailRequest = {
  phoneNumber: string;
  email: string;
  itemIds: string[];
  address: Address;
  payment: {
    provider?: PaymentProvider;
    type: PaymentType;
  };
};
