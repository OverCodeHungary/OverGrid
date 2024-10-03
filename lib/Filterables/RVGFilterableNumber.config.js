
export default {
  possibleOperations() {
    return {
      'eq': 'egyenlő ezzel:',
      'lt': 'kisebb, mint',
      'le': 'kisebb egyenlő, mint',
      'gt': 'nagyobb, mint',
      'ge': 'nagyobb egyenlő mint',
      'ne': 'nem egyenlő ezzel:'
    }
  },
  getTextual(operation, currentValue) {
    var possibleOperations = this.possibleOperations();
    return '%%fieldname%% ' + possibleOperations[operation] + ' ' + currentValue;
  },
  isMatch(recordValue, operation, matchingValue) {
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