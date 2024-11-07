type StatusFormatterConfig = {
  mapping: {
    [key: string]: {
      classList: string
      title: string
    }
  }
}

export default {
  possibleOperations(l: Function): Record<string, string> {
    return {
      'in': l('one_of_the_following')
    }
  },
  getTextual(l: Function, operation: any, currentValue: any, formatter?: StatusFormatterConfig) {
    var possibleOperations = this.possibleOperations(l);
    
    var translatedValues = [];
    for(var i in currentValue) {
      if(formatter && formatter.mapping && formatter.mapping[currentValue[i]]) {
        translatedValues.push(formatter.mapping[currentValue[i]].title);
      }
    }
    
    return '%%fieldname%% ' + possibleOperations[operation] + ' ' + translatedValues.join(", ")
  },
  isMatch(recordValue: string, operation: string, matchingValue: string[]) {
    switch(operation) {
      case 'in':
        return matchingValue.includes(recordValue);
    }
  }
}