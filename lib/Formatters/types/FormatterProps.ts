type PropsConfig<T> = {
  l: Function;
  theme: string;
  data: any;
  formatter: T;
  rowid: string | number;
  record: Record<string, any>;
  refreshGrid: () => void;
};

export default PropsConfig;