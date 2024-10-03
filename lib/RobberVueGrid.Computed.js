import RVGLocalStorageService from './RobberVueGrid.LocalStorage.js';

export default {
  
  needsToShowTopFiltersBar() {
    return (this.config.filtering && this.config.filtering.active) || this.needsToShowAdditionalOperationsDropdown;
  },
  needsToShowAdditionalOperationsDropdown() {
    return (this.config.columnSelector && this.config.columnSelector.active) 
    || (this.config.refreshable && this.config.refreshable.autoActive && this.config.refreshable.autoValues && this.config.refreshable.autoValues.length)
    || (this.config.pagination && this.config.pagination.possiblePageSizes)
    || (this.config.xlsxExport && this.config.xlsxExport.active);
  },




  allChecked: {
    get() {
      return this.records.length == this.checkedRows.length
    },
    set() {
    }
  },
  

}