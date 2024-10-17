class FilteringFilter {
  field: string;
  filterKey: string;
  type: string;
  operation: string;
  value: any;
  textual: string;

  constructor(field: string, filterKey: string, type: string, operation: string, value: any, textual: string) {
    this.field = field;
    this.filterKey = filterKey;
    this.type = type;
    this.operation = operation;
    this.value = value;
    this.textual = textual;
  }
}

enum FilteringOperator {
  and,
  or
}

class FilteringClass {
  active: boolean;
  operator: FilteringOperator;
  filters: Array<FilteringFilter>;
  isSimpleFilter: boolean;
  simpleFilterValue: string;

  initByState(isActive: boolean, filters: Array<FilteringFilter>, operator: FilteringOperator, isSimpleFilter: boolean, simpleFilterValue: string) {
    this.active = isActive;
    this.operator = operator;
    this.filters = filters;
    this.isSimpleFilter = isSimpleFilter;
    this.simpleFilterValue = simpleFilterValue;
  }

  setFilters(filters: Array<FilteringFilter>) {
    this.filters = filters;
  }

  constructor(active: boolean) {
    this.active = active;
    this.operator = FilteringOperator.and;
    this.filters = [];
    this.isSimpleFilter = false;
    this.simpleFilterValue = '';
  }
}

export { 
  FilteringFilter,
  FilteringOperator,
  FilteringClass
}