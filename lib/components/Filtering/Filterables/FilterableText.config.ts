export default {
  possibleOperations(l: Function): Record<string, string> {
    return {
      'eq': l('equals'),
      'cn': l('contains'),
      'bw': l('starts_with'),
      'ew': l('ends_with')
    }
  },
  getTextual(l: Function, operation: string, currentValue: string | null) {
    var possibleOperations = this.possibleOperations(l);
    return '%%fieldname%% ' + possibleOperations[operation] + ' ' + currentValue
  },
  isMatch(recordValue: string, operation: string, matchingValue: string) {
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