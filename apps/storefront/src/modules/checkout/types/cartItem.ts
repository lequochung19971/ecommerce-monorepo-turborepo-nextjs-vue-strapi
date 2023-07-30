import type { BaseModel } from '@/common/types';
import type { Product } from '@/modules/products';

import type { ShoppingSession } from './shoppingSession';

export type CartItem = BaseModel & {
  quantity: number;
  product: Product;
  shoppingSession: ShoppingSession;
};
