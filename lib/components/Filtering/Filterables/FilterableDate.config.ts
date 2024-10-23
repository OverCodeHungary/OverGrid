
import moment from 'moment';
import useI18n from '../../../composables/useI18n';
const i18n = useI18n('hu');

type StartAndEnd = string | { start: string, end: string };

export default {
  possibleOperations(): Record<string, string> {
    return {
      'eq': i18n.l('on_this_day'),
      'bw': i18n.l('in_this_interval')
    }
  },
  getTextual(operation: string, currentValue: StartAndEnd, convertUnixToReadable: boolean) {
    var possibleOperations = this.possibleOperations();

    if(operation == "bw") {
      if(typeof currentValue == "object") {
        var newCurrentValue = {
          start: currentValue.start,
          end: currentValue.end
        }

        if(convertUnixToReadable) {
          newCurrentValue.start = moment(currentValue.start).format("YYYY MMM. DD.")
          newCurrentValue.end = moment(currentValue.end).format("YYYY MMM. DD.")
        }

        return '%%fieldname%% ' + possibleOperations[operation] + ' ' + newCurrentValue.start + " - " + newCurrentValue.end
      }
      else {
        return 'ERROR';
      }
    }
    else {
      if(typeof currentValue == "string") {
        let currentValueStr = '';
        if(convertUnixToReadable) {
          currentValueStr = moment(currentValue).format("YYYY MMM. DD.")
        }
        return '%%fieldname%% ' + possibleOperations[operation] + ' ' + currentValueStr
      }
      else {
        return 'ERROR';
      }
    }
  },
  isMatch(recordValue: string, operation: string, matchingValue: StartAndEnd) {
    const momentFormat = "YYYY-MM-DD"
    switch(operation) {
      case 'eq':
        if(typeof matchingValue == "string") {
          return moment(recordValue).format(momentFormat) == moment(matchingValue).format(momentFormat);
        }
        else {
          return false;
        }
      case 'bw':
        if(typeof matchingValue == "object") {
          return moment(recordValue).format(momentFormat) < moment(matchingValue.end).format(momentFormat) && moment(recordValue).format(momentFormat) >= moment(matchingValue.start).format(momentFormat);
        }
        else {
          return false;
        }
        
    }
  }
}