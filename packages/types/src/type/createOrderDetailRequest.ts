import { PaymentType } from '../enum';
import { PaymentProvider } from '../enum/paymentProvider';
import { Address } from './address';

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
