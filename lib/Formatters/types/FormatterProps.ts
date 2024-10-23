type PropsConfig<T> = {
  data: any;
  config: T;
  rowid: string | number;
  record: Record<string, any>;
  refreshGrid: () => void;
};

export default PropsConfig;