import RVGLocalStorageService from './RobberVueGrid.LocalStorage.js';
import Utils from './RobberVueGridUtils.js'
import Axios from './helpers/axios.js';
import RVGFilterableNumberConfig from './Filterables/RVGFilterableNumber.config.js';
import RVGFilterableDateConfig from './Filterables/RVGFilterableDate.config.js';
import RVGFilterableStatusConfig from './Filterables/RVGFilterableStatus.config.js';
import RVGFilterableTextConfig from './Filterables/RVGFilterableText.config.js';
import l from './helpers/lang.js'

export default {
  reloadPage() {
    window.location.reload();
  },
  registerEvent(event, callback) {
    this.registeredEvents[event] = callback;
  },
  showFilterBar() {
    if (!this.filter.filterBarShown) {
      this.filter.filterBarShown = true;
    }
    else {
      this.filter.conditions = [];
      this.filter.filterBarShown = false;
      this.refreshNeeded = true;
    }
  },
  changeFilterValue(id, condition) {
    this.filter.conditions.push(condition);
    this.refreshNeeded = true;
  },
  checkAll(value) {
    if (!value) {
      this.checkedRows = [];
      return;
    }

    var newCheckedRows = [];
    for (var i in this.records) {
      newCheckedRows.push(this.records[i].id)
    }
    this.checkedRows = newCheckedRows;
  },
  
  
  
}