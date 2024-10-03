// LocalStorageService.js
const RVGLocalStorageService = (function(){
  var _service;
  function _getService() {
      if(!_service) {
        _service = this;
        return _service
    }
    return _service
  }

  function _getStorageValue(storageKey) {
    return localStorage.getItem(storageKey);
  }

  function _setStorageValue(storageKey, storageValue) {
    localStorage.setItem(storageKey, storageValue);
  }

  return {
    getService : _getService,
    setStorageValue : _setStorageValue,
    getStorageValue : _getStorageValue
  }
})();

export default RVGLocalStorageService;
 