
export default function useColumnsVisible() {
  return {
    titlesVisible: (config) => {
      var enabledColumns = false;
      if(config.columnSelector && config.columnSelector.active) {
        enabledColumns = localStorage.getItem('columns_' + config.gridUniqueId);

        if(enabledColumns) {
          enabledColumns = enabledColumns.split(',');
        }
      }

      var titles = {};
      for(var i in config.mapping) {
        if(config.mapping[i].visible) {
          if(!enabledColumns || (typeof enabledColumns == "object" && enabledColumns.indexOf(i) > -1)) {
            titles[i] = {
              key: i,
              title: config.mapping[i].title,
              orderable: config.mapping[i].orderable,
              filterable: config.mapping[i].filterable,
              filterable_config: config.mapping[i].filterable_config,
              width: config.mapping[i].width
            };
          }
        }
      }

      return titles;
    },

    mappingVisible: (config) => {
      var enabledColumns = false;
      if(config.columnSelector && config.columnSelector.active) {
        enabledColumns = localStorage.getItem('columns_' + config.gridUniqueId);
        
        if(enabledColumns) {
          enabledColumns = enabledColumns.split(',');
        }
      }

      var mapping = {};
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