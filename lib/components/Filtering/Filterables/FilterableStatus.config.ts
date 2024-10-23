import useI18n from '../../../composables/useI18n';
const i18n = useI18n('hu');

type StatusFormatterConfig = {
  mapping: {
    [key: string]: {
      classList: string
      title: string
    }
  }
}

export default {
  possibleOperations(): Record<string, string> {
    return {
      'in': i18n.l('one_of_the_following')
    }
  },
  getTextual(operation: any, currentValue: any, formatter?: StatusFormatterConfig) {
    var possibleOperations = this.possibleOperations();
    
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