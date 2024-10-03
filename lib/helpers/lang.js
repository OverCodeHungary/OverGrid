const i18n = {
  en: {},
  hu: {
  }
}

export default (key, params = null) => {
  let currentLang = localStorage.getItem('lang') || 'hu';
  if(!i18n[currentLang]) {
    localStorage.setItem('lang', 'hu');
    currentLang = 'hu';
  }

  if(params) {
    let tempStr = i18n[currentLang][key];
    if(!tempStr) return key;
    
    for(let i in params) {
      tempStr = tempStr.replace("{" + i + "}", params[i]);
    }

    return tempStr;
  }
  else {
    return i18n[currentLang][key] || key;
  }
}