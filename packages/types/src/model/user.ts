import { BaseModel } from './baseModel';

export type User = BaseModel & {
  id: string;
  username: string;
  email: string;
};
