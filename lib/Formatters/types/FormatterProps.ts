type PropsConfig = {
  data: any;
  config: {
    formatter: {
      badgeStyle: string;
      dataType: string;
      mapping: Record<string, { title: string; classList: string }>;
    };
  };
  rowid: string | number;
  record: Record<string, any>;
  refreshGrid: () => void;
};

export default PropsConfig;