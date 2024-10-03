
export default {
  possibleOperations() {
    return {
      'in': 'az alábbiak valamelyike:'
    }
  },
  getTextual(operation, currentValue, formatter) {
    var possibleOperations = this.possibleOperations();
    
    var translatedValues = [];
    for(var i in currentValue) {
      if(formatter && formatter.mapping && formatter.mapping[currentValue[i]]) {
        translatedValues.push(formatter.mapping[currentValue[i]].title);
      }
    }
    
    return '%%fieldname%% ' + possibleOperations[operation] + ' ' + translatedValues.join(", ")
  },
  isMatch(recordValue, operation, matchingValue) {
    switch(operation) {
      case 'in':
        return matchingValue.includes(recordValue);
    }
  }
}