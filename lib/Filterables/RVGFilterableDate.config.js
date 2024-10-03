
import moment from 'moment';

export default {
  possibleOperations() {
    return {
      'eq': 'ezen a napon:',
      'bw': 'ebben az intervallumban:'
    }
  },
  getTextual(operation, currentValue, convertUnixToReadable) {
    var possibleOperations = this.possibleOperations();

    if(operation == "bw") {
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
      if(convertUnixToReadable) {
        currentValue = moment(currentValue).format("YYYY MMM. DD.")
      }
      return '%%fieldname%% ' + possibleOperations[operation] + ' ' + currentValue
    }
  },
  isMatch(recordValue, operation, matchingValue) {
    const momentFormat = "YYYY-MM-DD"
    switch(operation) {
      case 'eq':
        return moment(recordValue).format(momentFormat) == moment(matchingValue).format(momentFormat);
      case 'bw':
        return moment(recordValue).format(momentFormat) < moment(matchingValue.end).format(momentFormat) && moment(recordValue).format(momentFormat) >= moment(matchingValue.start).format(momentFormat);
    }
  }
}