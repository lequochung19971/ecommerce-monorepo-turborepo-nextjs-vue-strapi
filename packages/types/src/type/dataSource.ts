export type DataSource<T = unknown, TMeta extends object = object> = {
  label: string;
  value: T;
  meta?: TMeta;
};
