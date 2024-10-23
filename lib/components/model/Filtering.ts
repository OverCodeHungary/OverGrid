class FilteringFilter {
  field: string;
  filterKey: string;
  type: string;
  operation: string;
  value: any;
  textual: string;
  _opselector?: boolean;

  constructor(field: string, filterKey: string, type: string, operation: string, value: any, textual: string) {
    this.field = field;
    this.filterKey = filterKey;
    this.type = type;
    this.operation = operation;
    this.value = value;
    this.textual = textual;
    this._opselector = false;
  }
}

enum FilteringOperator {
  and,
  or
}

/**
 * Adds two values and returns the sum.
 *
 * @example
 * ```ts
 * import { sum } from "jsr:@deno/sum";
 * const finalValue = sum(1, "this is a string"); // 3
 * ```
 */
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

  constructor() {
    this.active = false;
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