import useI18n from '../../../composables/useI18n';
const i18n = useI18n('hu');

export default {
  possibleOperations(): Record<string, string> {
    return {
      'eq': i18n.l('equals'),
      'cn': i18n.l('contains'),
      'bw': i18n.l('starts_with'),
      'ew': i18n.l('ends_with')
    }
  },
  getTextual(operation: string, currentValue: string | null) {
    var possibleOperations = this.possibleOperations();
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