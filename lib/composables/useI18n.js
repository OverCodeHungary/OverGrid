import i18nhu from '../i18n/hu.i18n.js';

let currentLang = 'hu';
let i18n = {
  hu: i18nhu
};

let l = (key, params = null) => {
  // if(!i18n[currentLang]) {
  //   localStorage.setItem('lang', 'hu');
  //   currentLang = 'hu';
  // }

  // if(STORE_MISSING_LANG_KEYS && !i18n[currentLang][key]) {
  //   storeMissingLangKeys(key, currentLang)
  // }

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

export default function useI18n(lang) {
  currentLang = lang || 'hu';

  return {
    l
  }
}