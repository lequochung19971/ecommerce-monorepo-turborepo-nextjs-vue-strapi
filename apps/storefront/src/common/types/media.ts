import type { BaseModel } from './baseModel';

export type Media = BaseModel & {
  name: string;
  url: string;
  size: number;
  mime: string;
  ext: string;
  height: number;
  width: number;
  hash: string;
};
