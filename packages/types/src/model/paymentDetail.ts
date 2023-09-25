import { PaymentProvider } from '../enum/paymentProvider';
import { PaymentStatus } from '../enum/paymentStatus';
import { PaymentType } from '../enum/paymentType';
import { BaseModel } from './baseModel';
import { OrderDetail } from './orderDetail';

export type PaymentDetail = BaseModel & {
  provider: PaymentProvider;
  status: PaymentStatus;
  type: PaymentType;
  orderDetail: OrderDetail;
  extraInfo?: string;
};
