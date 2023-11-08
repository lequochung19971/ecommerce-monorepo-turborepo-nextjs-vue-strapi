import { BaseModel } from './baseModel';
export type FileInfo = {
  ext: string;
  url: string;
  hash?: string;
  mime: string;
  name: string;
  path?: any;
  size: number;
  width: number;
  height: number;
};

export type Media = BaseModel &
  FileInfo & {
    alternativeText?: string;
    caption?: string;
    previewUrl?: string;
    provider: string;
    provider_metadata?: any;
    formats?: {
      large: FileInfo;
      small: FileInfo;
      medium: FileInfo;
      thumbnail: FileInfo;
    };
  };
