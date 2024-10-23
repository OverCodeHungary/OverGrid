import { OverGridConfig, MappingRecordType } from "../components/model/OverGridConfig";

export default function useColumnsVisible() {
  return {
    titlesVisible: (config: OverGridConfig) => {
      let enabledColumnsStr: string | null = '';
      let enabledColumns: string[] = [];
      if(config.columnSelector && config.columnSelector.active) {
        enabledColumnsStr = localStorage.getItem('columns_' + config.gridUniqueId);

        if(enabledColumnsStr) {
          enabledColumns = enabledColumnsStr.split(',');
        }
      }

      let titles: Record<string, {
        key: string,
        title: string,
        orderable: boolean,
        filterable?: {
          active: boolean,
          type: string
        },
        //filterable_config: Record<string, any>,
        width?: string
      }> = {};

      for(var i in config.mapping) {
        if(config.mapping[i].visible) {
          if(!enabledColumns || (typeof enabledColumns == "object" && enabledColumns.indexOf(i) > -1)) {
            titles[i] = {
              key: i,
              title: config.mapping[i].title,
              orderable: config.mapping[i].orderable ? true : false,
              filterable: config.mapping[i].filterable ? config.mapping[i].filterable : undefined,
              //filterable_config: config.mapping[i].filterable_config,
              width: config.mapping[i].width
            };
          }
        }
      }

      return titles;
    },

    mappingVisible: (config: OverGridConfig) => {
      let enabledColumnsStr: string | null = '';
      let enabledColumns: string[] = [];

      if(config.columnSelector && config.columnSelector.active) {
        enabledColumnsStr = localStorage.getItem('columns_' + config.gridUniqueId);
        
        if(enabledColumnsStr) {
          enabledColumns = enabledColumnsStr.split(',');
        }
      }

      var mapping: Record<string, MappingRecordType> = {};
      for(var i in config.mapping) {
        if(config.mapping[i].visible) {
          if(!enabledColumns || (typeof enabledColumns == "object" && enabledColumns.indexOf(i) > -1)) {
            mapping[i] = config.mapping[i];
          }
        }
      }

      return mapping;
    }
  }
}