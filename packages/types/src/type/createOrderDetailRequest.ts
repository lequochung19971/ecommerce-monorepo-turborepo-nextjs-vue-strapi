import { PaymentMethod } from '../enum';
import { PaymentProvider } from '../enum/paymentProvider';
import { OrderDetail, OrderItem, User } from '../model';
import { Address } from './address';

export type CreateOrderDetailRequest = {
  phoneNumber: string;
  email: string;
  itemIds?: string[];
  address?: Address;
  payment: {
    provider?: PaymentProvider;
    method: PaymentMethod;
  };
  user?: {
    id: string;
  };
  orderItems?: OrderItem[];
  rider?: OrderDetail['rider'];
};
