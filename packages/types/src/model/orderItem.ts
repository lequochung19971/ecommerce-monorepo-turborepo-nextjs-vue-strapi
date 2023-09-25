import { BaseModel } from './baseModel';
import { OrderDetail } from './orderDetail';
import { Product } from './product';

export type OrderItem = BaseModel & {
  quantity: number;
  product: Product;
  orderDetail: OrderDetail;
};
