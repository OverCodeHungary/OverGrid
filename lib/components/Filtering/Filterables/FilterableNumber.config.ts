
export default {
  possibleOperations(l: Function): Record<string, string> {
    return {
      'eq': l('equals'),
      'lt': l('less_than'),
      'le': l('less_than_equals'),
      'gt': l('greater_than'),
      'ge': l('greater_than_equals'),
      'ne': l('not_equals')
    }
  },
  getTextual(l: Function, operation: string, currentValue: any) {
    var possibleOperations = this.possibleOperations(l);
    return '%%fieldname%% ' + possibleOperations[operation] + ' ' + currentValue;
  },
  isMatch(recordValue: string, operation: string, matchingValue: string) {
    switch(operation) {
      case 'eq':
        return recordValue == matchingValue;
      case 'lt':
        return recordValue < matchingValue;
      case 'le':
        return recordValue <= matchingValue;
      case 'gt':
        return recordValue > matchingValue;
      case 'ge':
        return recordValue >= matchingValue;
      case 'ne':
        return recordValue != matchingValue;
    }
  }
}