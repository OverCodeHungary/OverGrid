import FilterableNumberConfig from '../components/Filtering/Filterables/FilterableNumber.config.js';
import FilterableDateConfig from '../components/Filtering/Filterables/FilterableDate.config.js';
import FilterableStatusConfig from '../components/Filtering/Filterables/FilterableStatus.config.js';
import FilterableTextConfig from '../components/Filtering/Filterables/FilterableText.config.js';

export default () => {

  return {

    isRecordMatchTheCurrentFiltering: (record, filters, filterOperator) => {
      if(filters.length <= 0) {
        return true;
      }

      var matchBools = [];
      for(var i in filters) {
        var cFilter = filters[i];
        if(cFilter.type == "number") {
          matchBools.push(FilterableNumberConfig.isMatch(record[cFilter.field], cFilter.operation, cFilter.value));
        }
        if(cFilter.type == "date") {
          matchBools.push(FilterableDateConfig.isMatch(record[cFilter.field], cFilter.operation, cFilter.value));
        }
        if(cFilter.type == "status") {
          matchBools.push(FilterableStatusConfig.isMatch(record[cFilter.field], cFilter.operation, cFilter.value));
        }
        if(cFilter.type == "text") {
          matchBools.push(FilterableTextConfig.isMatch(record[cFilter.field], cFilter.operation, cFilter.value));
        }
      }

      if(matchBools.length <= 0) {
        return true;
      }

      if(filterOperator.toLowerCase() == "and") {
        return matchBools.includes(false) ? false : true;
      }

      if(filterOperator.toLowerCase() == "or") {
        return matchBools.includes(true) ? true : false;
      }
    },

    sortRecords: (recArray, field, direction, fieldMappingConfig) => {
      return recArray.sort(function(first, second) {
        var a;
        var b;
  
        if(fieldMappingConfig && fieldMappingConfig.formatter && fieldMappingConfig.formatter.type && fieldMappingConfig.formatter.type.toLowerCase() == "status" && fieldMappingConfig.formatter.mapping) {
          a = fieldMappingConfig.formatter.mapping[first[field]].title.toLowerCase();
          b = fieldMappingConfig.formatter.mapping[second[field]].title.toLowerCase();        
        }
        else {
          if(first[field] && typeof first[field] == "string") { a = first[field].toLowerCase(); } else { a = ""; }
          if(second[field] && typeof second[field] == "string") { b = second[field].toLowerCase(); } else { b = ""; }
  
          if(typeof first[field] == "number") { a = first[field] }
          if(typeof second[field] == "number") { b = second[field] }
        }
  
        if(direction == "asc") {
          if(a < b) { return -1; }
          else if(a > b) { return 1; }
          else { return 0;}
        }
        else {
          if(a > b) { return -1; }
          else if(a < b) { return 1; }
          else { return 0; }
        }
      });
    }
  }
}