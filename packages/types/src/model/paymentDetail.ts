import { PaymentProvider } from '../enum/paymentProvider';
import { PaymentStatus } from '../enum/paymentStatus';
import { PaymentMethod } from '../enum/paymentMethod';
import { BaseModel } from './baseModel';
import { OrderDetail } from './orderDetail';

export type PaymentDetail = BaseModel & {
  provider?: PaymentProvider;
  status?: PaymentStatus;
  method?: PaymentMethod;
  orderDetail?: OrderDetail;
  extraInfo?: string;
};
