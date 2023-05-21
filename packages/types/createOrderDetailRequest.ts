import { Address } from './address';
export type CreateOrderDetailRequest = {
  phoneNumber: string;
  email: string;
  itemIds: string[];
  address: Address;
};
