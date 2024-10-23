import useI18n from '../../../composables/useI18n.js';
const i18n = useI18n('hu');

export default {
  possibleOperations(): Record<string, string> {
    return {
      'eq': i18n.l('equals'),
      'lt': i18n.l('less_than'),
      'le': i18n.l('less_than_equals'),
      'gt': i18n.l('greater_than'),
      'ge': i18n.l('greater_than_equals'),
      'ne': i18n.l('not_equals')
    }
  },
  getTextual(operation: string, currentValue: any) {
    var possibleOperations = this.possibleOperations();
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