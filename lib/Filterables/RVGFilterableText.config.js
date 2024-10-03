
export default {
  possibleOperations() {
    return {
      'eq': 'megegyezik ezzel:',
      'cn': 'tartalmazza ezt:',
      'bw': 'ezzel kezdődik:',
      'ew': 'ezzel végződik:'
    }
  },
  getTextual(operation, currentValue) {
    var possibleOperations = this.possibleOperations();
    return '%%fieldname%% ' + possibleOperations[operation] + ' ' + currentValue
  },
  isMatch(recordValue, operation, matchingValue) {
    if(recordValue === null || recordValue === undefined) {
      return false;
    }

    recordValue = recordValue.toString().toLowerCase();
    matchingValue = matchingValue.toString().toLowerCase();

    switch(operation) {
      case 'eq':
        return recordValue == matchingValue;
      case 'cn':
        return recordValue.indexOf(matchingValue) > -1;
      case 'bw':
        return recordValue.match(new RegExp('^' + matchingValue + '.*$')) != null;
      case 'ew':
        return recordValue.match(new RegExp('^.*' + matchingValue + '$')) != null;
    }
  }
}