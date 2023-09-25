import { BaseModel } from './baseModel';
import { OrderItem } from './orderItem';
import { OrderStatus } from '../enum/orderStatus';
import { PaymentDetail } from './paymentDetail';
import { User } from './user';
import { Address } from '../type/address';

export type OrderDetail = BaseModel & {
  user: User;
  email: string;
  phoneNumber: string;
  orderItems: OrderItem[];
  address?: Address;
  paymentDetail: PaymentDetail;
  orderStatus: OrderStatus;
};
