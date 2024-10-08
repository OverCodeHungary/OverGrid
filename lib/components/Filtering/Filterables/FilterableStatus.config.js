import useI18n from '../../../composables/useI18n.js';
const i18n = useI18n('hu');

export default {
  possibleOperations() {
    return {
      'in': i18n.l('one_of_the_following')
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